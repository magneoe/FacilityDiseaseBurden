import {Component} from "@angular/core";
import {IUpdateableComponent} from "../../services/IUpdateable.component";
import {Observable} from "rxjs/Observable";
import {TrackedEntity} from "../../models/TrackedEntity.model";
import {Logger} from "angular2-logger/core";
import {FilterQuery} from "../../models/FilterQuery.model";
import {Dataset} from "../../models/Dataset.model";
import {OrganizationUnit} from "../../models/OrganizationUnit.model";
import {CommonResourceDispatcherService} from "../../services/dataInput/CommonResourceDispatcher.service";

@Component({
    selector: 'selectedDatasetManager',
    templateUrl: '../../views/selectedDatasetManager.component.html',
})

export class SelectedDatasetManager implements IUpdateableComponent {
    activeDatasets: Dataset[] = [];

    constructor(private _logger: Logger, private _commonResourceDispatcher:CommonResourceDispatcherService) {
    }

    public update(dataset: Dataset, stackData: boolean, callOnFinish: any): void {
        if (!stackData)
            this.activeDatasets = [];
        let numberOfEntitiesInDataset: number = 0;
        dataset.getTrackedEntityResults().forEach((trackedEntities: TrackedEntity[], orgUnit: OrganizationUnit) => {
            numberOfEntitiesInDataset += trackedEntities.length;
        });
        dataset.setEntitiesInTotal(numberOfEntitiesInDataset);
        this.activeDatasets.push(dataset);
        callOnFinish(this);
    }

    public delete(dataset:Dataset, callOnFinish:any):void {
        console.log('Recieved delete command', dataset);
        this.activeDatasets = this.activeDatasets.filter(curr => {return curr.getDatasetId() !== dataset.getDatasetId()});
        callOnFinish(this);
    }
    public deleteDataset(dataset:Dataset):void {
        this._commonResourceDispatcher.deleteDataset(dataset);
    }

    public getFilterDisplayString(filterQueryMap: Map<string, FilterQuery[]>): string[] {
        let filterDisplayStrings: string[] = [];
        filterQueryMap.forEach((filterQueryArray: FilterQuery[], key: string) => {
            filterQueryArray.forEach(filterQuery => {
                filterDisplayStrings.push(filterQuery.getDisplayString());
            });

        });
        return filterDisplayStrings;
    }
}