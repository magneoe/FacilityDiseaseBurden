import {Injectable} from "@angular/core";
import {MapComponent} from "../../components/map/map.component";
import {TemporalDimensionComponent} from "../../components/temporal/TemporalDimension.component";
import {InputDataObject} from "../../models/InputDataObject.model";
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
import {MapService} from "../map/map.service";
import {NgProgress} from "ngx-progressbar";
import {IUpdateableComponent} from "../IUpdateable.component";

@Injectable()
export class CommonResourceDispatcherService {

    private subscription: Subscription;
    private dataInputBuilder: DataInputBuilderUtil;

    constructor(private _mapInputDataService: MapInputDataService, private _organisationLoaderService: OrganizationUnitLoaderService,
                private _logger: Logger, private _trackedEntityLoaderService: TrackedEntityLoaderService) {
        this.dataInputBuilder = new DataInputBuilderUtil(_logger);

        // Subscribes to the Validation message service used by the child components for sending validation messages.
        this.subscription = this._mapInputDataService.getInputDataMessage().subscribe((inputDataMessage: InputDataMessage) => {
            this.handleInputDataMessage(inputDataMessage);
        });
    }

    public handleUpdate(updateableComponents: IUpdateableComponent[], stackData: boolean, callOnFinish: any) {
        let inputDataObject: InputDataObject = this.dataInputBuilder.createDataInputObject();

        this.getOrgUnitChildern(inputDataObject).subscribe((units: any) => {
            //Need to resolve all subunits connected to the program (if any) - saves resources by performing the task after the form is submitted
            let orgUnitsToLoad: OrganizationUnit[] = this.getOrgUnitsToLoad(inputDataObject, units);
            /*
             * For each selected programs one single layer group is being loaded,
             * containing all the markers and polyfigures connected to the program.
             */
            for (let selOrgIndex = 0; selOrgIndex < orgUnitsToLoad.length; selOrgIndex++) {
                for (let selProgIndex = 0; selProgIndex < inputDataObject.getSelectedPrograms().length; selProgIndex++) {

                    let trackedEntities: Observable<TrackedEntity[]> = this._trackedEntityLoaderService.getTrackedEntityInstancesByQuery(
                        orgUnitsToLoad[selOrgIndex],
                        inputDataObject.getSelectedPrograms()[selProgIndex],
                        inputDataObject.getStartDate(),
                        inputDataObject.getEndDate(),
                        inputDataObject.getFilterQueryMap());

                    let localInputDataObj: InputDataObject = new InputDataObject(
                        inputDataObject.getSelectedPrograms(),
                        inputDataObject.getSelectedOrgUnit(),
                        inputDataObject.getStartDate(),
                        inputDataObject.getEndDate(),
                        inputDataObject.getFilterQueryMap());

                    localInputDataObj.setSelectedOrgUnit(orgUnitsToLoad[selOrgIndex]);
                    localInputDataObj.setSelectedPrograms([inputDataObject.getSelectedPrograms()[selProgIndex]]);
                    updateableComponents.forEach(comp => {
                        if (comp !== null)
                            comp.addData(localInputDataObj, trackedEntities);
                    });
                }
            }
            updateableComponents.forEach(comp => {
                if (comp !== null)
                    comp.update(inputDataObject, stackData, callOnFinish);
            });
        });
    }

    private getOrgUnitsToLoad(inputDataObject: InputDataObject, units: any): OrganizationUnit[] {
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

    /*
     * Receives all map input data and store them in an inputData variable
     */
    protected handleInputDataMessage(inputDataMessage: InputDataMessage) {
        let dataContent = inputDataMessage.getDataContent();
        switch (dataContent) {
            case InputDataContent.ORG_UNIT:
                this.dataInputBuilder.setSelectedOrgUnit(inputDataMessage.getPayload());
                break;
            case InputDataContent.PROGRAMS:
                this.dataInputBuilder.setSelectedPrograms(inputDataMessage.getPayload());
                break;
            case InputDataContent.END_DATE:
                this.dataInputBuilder.setSelectedEndDate(inputDataMessage.getPayload());
                break;
            case InputDataContent.START_DATE:
                this.dataInputBuilder.setSelectedStartDate(inputDataMessage.getPayload());
                break;
            case InputDataContent.FILTER_QUERY_MAP:
                this.dataInputBuilder.mergeFilterQueries(inputDataMessage.getPayload());
                break;
        }
    }

    private getOrgUnitChildern(inputDataModel: InputDataObject): Observable<OrganizationUnit[]> {
        if (inputDataModel === null || inputDataModel.getSelectedOrgUnit() === null ||
            inputDataModel.getSelectedPrograms() === null) {
            //Do some errorHandling
            return;
        }
        return this._organisationLoaderService.getOrgUnits('api/organisationUnits?fields=[id,displayName,level,coordinates,' +
            'children::size~rename(ChildCount)]&paging=0&filter=ancestors.id:eq:' + inputDataModel.getSelectedOrgUnit().id);
    }
}
