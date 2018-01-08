

import {Component} from "@angular/core";
import {IUpdateableComponent} from "../../services/IUpdateable.component";
import {InputDataObject} from "../../models/InputDataObject.model";
import {Observable} from "rxjs/Observable";
import {TrackedEntity} from "../../models/TrackedEntity.model";
import {Logger} from "angular2-logger/core";
import {FilterQuery} from "../../models/FilterQuery.model";
import {ValidationMessage} from "../../models/ValidationMessage.model";

@Component({
    selector: 'selectedDatasetManager',
    templateUrl: '../../views/selectedDatasetManager.component.html',
})

export class SelectedDatasetManager implements IUpdateableComponent{
    private trackedEntityQueue:Observable<TrackedEntity[]>[] = [];
    inputDataObjects: any[] = [];

    constructor(private _logger: Logger){
    }
    public addData(inputDataObject:InputDataObject, trackedEntities:Observable<TrackedEntity[]>) {
        this.trackedEntityQueue.push(trackedEntities);
    }
    public update(inputDataObject: any, stackData:boolean, callOnFinish:any): void {
        this._logger.log('Stack data:', stackData);
        if(!stackData)
            this.inputDataObjects = [];
        this._logger.log('Selected dataset manager:', inputDataObject);
        inputDataObject.numberOfEntities = 0;
        this.inputDataObjects.push(inputDataObject);

        Observable.forkJoin(this.trackedEntityQueue).subscribe((entityArray:any[]) => {
            this._logger.log('Number of enities loaded:', entityArray);
            let numberOfEntities:number = 0;
            entityArray.forEach(entitiesByProgram => {
                numberOfEntities += entitiesByProgram.trackedEntityInstances.length;
            });
            inputDataObject.numberOfEntities = numberOfEntities;
            inputDataObject.filterDisplayStrings = [];
            inputDataObject.getFilterQueryMap().forEach((filterQueryArray:FilterQuery[], key:string) => {
                filterQueryArray.forEach(filterQuery => {
                    console.log('Filter query:', filterQuery);
                    inputDataObject.filterDisplayStrings.push(filterQuery.getDisplayString());
                });

            });
            this.trackedEntityQueue = [];
            callOnFinish(this);
        });

    }
}