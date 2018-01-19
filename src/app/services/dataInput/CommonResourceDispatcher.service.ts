import {Injectable} from "@angular/core";
import {Dataset} from "../../models/Dataset.model";
import {Observable} from "rxjs/Rx";
import {TrackedEntity} from "../../models/TrackedEntity.model";
import {OrganizationUnit} from "../../models/OrganizationUnit.model";
import {InputDataMessage} from "../../models/InputDataMessage.model";
import {Subscription} from "rxjs/Subscription";
import {DataInputBuilderUtil} from "../../utils/DataInputBuilder.util";
import {OrganizationUnitLoaderService} from "../dataLoading/organizationUnitLoader.service";
import {MapInputDataService} from "./mapInputData.service";
import {Logger} from "angular2-logger/core";
import {TrackedEntityLoaderService} from "../dataLoading/TrackedEntityLoaderService.service";
import {InputDataContent} from "../../enums/InputDataContent.enum";
import {IUpdateableComponent} from "../IUpdateable.component";
import {MapObjectFactory} from "../../utils/MapObjectFactory.util";
import {NgProgress} from "ngx-progressbar";

@Injectable()
export class CommonResourceDispatcherService {

    private updateableComponents: IUpdateableComponent[] = [];

    constructor(private _organisationLoaderService: OrganizationUnitLoaderService,
                private _logger: Logger,
                private _trackedEntityLoaderService: TrackedEntityLoaderService,
                private _ngProgress: NgProgress) {

    }
    public setUpdatableComponents(updateableComponents: IUpdateableComponent[]):void {
        this.updateableComponents = updateableComponents;
    }

    public handleUpdate(dataset:Dataset, stackData: boolean) {
        if(dataset === null)
            return;
        let callOnFinish:any = this.startTimer(this.updateableComponents);
        try {
            this.getOrgUnitChildern(dataset).subscribe((units: any) => {
                //Need to resolve all subunits connected to the program (if any) - saves resources by performing the task after the form is submitted
                let orgUnitsToLoad: OrganizationUnit[] = this.getOrgUnitsToLoad(dataset, units);
                /*
                 * For each selected programs one single layer group is being loaded,
                 * containing all the markers and polyfigures connected to the program.
                 */
                for (let selOrgIndex = 0; selOrgIndex < orgUnitsToLoad.length; selOrgIndex++) {
                    for (let selProgIndex = 0; selProgIndex < dataset.getSelectedPrograms().length; selProgIndex++) {

                        let trackedEntities: Observable<TrackedEntity[]> = this._trackedEntityLoaderService.getTrackedEntityInstancesByQuery(
                            orgUnitsToLoad[selOrgIndex],
                            dataset.getSelectedPrograms()[selProgIndex],
                            dataset.getStartDate(),
                            dataset.getEndDate(),
                            dataset.getFilterQueryMap());
                        dataset.addTrackedEntityQuery(orgUnitsToLoad[selOrgIndex], trackedEntities);
                    }
                }
                this.loadTracedEntitiesAsync(dataset, stackData, callOnFinish);
            });
        }
        catch(error){
            this._logger.log(error);
        }
    }

    private loadTracedEntitiesAsync(dataset:Dataset, stackData: boolean, callOnFinish:any):void {
        let trackedEntityQueue: Observable<TrackedEntity[]>[] = Array.from(dataset.getTrackedEntityQueryMap().values());
        let organisationUnits:OrganizationUnit[] = Array.from(dataset.getTrackedEntityQueryMap().keys());

        Observable.forkJoin(trackedEntityQueue).subscribe((resultArray: any[]) => {

            for (let i = 0; i < resultArray.length; i++) {
                let trackedEntitiesArray: TrackedEntity[] = [];
                resultArray[i].trackedEntityInstances.forEach((unit: TrackedEntity) => {
                    trackedEntitiesArray.push(new TrackedEntity(unit.attributes, unit.enrollments));
                });
                dataset.addTrackedEntityResults(organisationUnits[i], trackedEntitiesArray);
            }
            this.updateableComponents.forEach(comp => {
                if (comp !== null)
                    comp.update(dataset, stackData, callOnFinish);
            });
        });
    }

    deleteDataset(dataset:Dataset):void {
        if(dataset === null)
            return;
        try {
            let callOnFinish = this.startTimer(this.updateableComponents);
            this.updateableComponents.forEach(comp => {
               comp.delete(dataset, callOnFinish);
               MapObjectFactory.releaseColor(dataset.getColor());
            });
        }
        catch(error) { this._logger.log(error);}
    }

    private getOrgUnitsToLoad(inputDataObject: Dataset, units: any): OrganizationUnit[] {
        //Need to resolve all subunits connected to the program (if any) - saves resources by performing the task after the form is submitted
        let orgUnitsToLoad: OrganizationUnit[] = units.organisationUnits.filter((orgUnit: any) => {
            if (orgUnit.ChildCount === 0 && orgUnit.coordinates !== undefined)
                return true;
            return false;
        });
        if (orgUnitsToLoad === null || orgUnitsToLoad.length === 0)
            orgUnitsToLoad = [inputDataObject.getSelectedOrgUnit()];
        return orgUnitsToLoad;
    }


    private startTimer(updateableComponents:IUpdateableComponent[]):any {
        //The list of components that still not have reported that their are finished
        let pendingComponentsInProgress: IUpdateableComponent[] = [];
        pendingComponentsInProgress = pendingComponentsInProgress.concat(updateableComponents);

        //Upon finshed - remove the component from the pendingComponentsList
        const callOnFinish = (component: any) => {
            for (let i = 0; i < pendingComponentsInProgress.length; i++) {
                if (pendingComponentsInProgress[i] === component) {
                    pendingComponentsInProgress = pendingComponentsInProgress.filter(comp => {
                        if (comp !== pendingComponentsInProgress[i])
                            return true;
                    });
                }
            }
            //When all are done, stop the progressbar
            if (pendingComponentsInProgress.length === 0) {
                this._ngProgress.done();
            }
        };

        this._ngProgress.start();
        //To avoid infinite loading...
        setTimeout(() => {
            if (pendingComponentsInProgress.length > 0) {
                alert('The server is too slow, or something went wrong :(');
                pendingComponentsInProgress = [];
                callOnFinish(null);
            }
        }, 1000 * 120);
        return callOnFinish;
    }



    private getOrgUnitChildern(dataset: Dataset): Observable<OrganizationUnit[]> {
        if (dataset === null || dataset.getSelectedOrgUnit() === null ||
            dataset.getSelectedPrograms() === null) {
            //Do some errorHandling
            return;
        }
        return this._organisationLoaderService.getOrgUnits('api/organisationUnits?fields=[id,displayName,level,coordinates,' +
            'children::size~rename(ChildCount)]&paging=0&filter=ancestors.id:eq:' + dataset.getSelectedOrgUnit().id);
    }
}
