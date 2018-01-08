import {Component} from "@angular/core";
import {Logger} from "angular2-logger/core";
import {InputDataObject} from "../../models/InputDataObject.model";
import {Observable} from "rxjs/Observable";
import {TrackedEntity} from "../../models/TrackedEntity.model";
import {NgProgress} from "ngx-progressbar";
import {IUpdateableComponent} from "../../services/IUpdateable.component";

@Component({
  selector: 'temporalComponent',
  templateUrl: '../../views/temporal.component.html',
})

export class TemporalDimensionComponent implements IUpdateableComponent{

  private activeInputData: InputDataObject;
  private trackedEntityQueue:Observable<TrackedEntity[]>[] = [];
  private trackedEntityAttributes:InputDataObject[] = [];

  constructor(private _logger: Logger, private _ngProgress:NgProgress){}

  public update(inputDataObject:InputDataObject, stackData:boolean, callOnFinish:any){
      this._logger.log("UpdateTemporalDimension invoked", inputDataObject);
    this.clear();
    this.activeInputData = inputDataObject;

    Observable.forkJoin(this.trackedEntityQueue).subscribe((entityArray:any[]) => {
      this._logger.debug("Update map trackedEntitiy observables:", entityArray);
      for(let i = 0; i < entityArray.length; i++){
        this._logger.debug("Entities on program:", entityArray[i]);

        let trackedEntitiesArray: TrackedEntity[] = [];
        entityArray[i].trackedEntityInstances.forEach((unit: TrackedEntity) => {
          trackedEntitiesArray.push(new TrackedEntity(unit.attributes, unit.lastUpdated));
        });

        //Do something with the datas

      };
      this.trackedEntityAttributes = [];
      this.trackedEntityQueue = [];
      callOnFinish(this);
    });
  }

  public addData(inputDataObject:InputDataObject, trackedEntities:Observable<TrackedEntity[]>):void{
    this._logger.log("Add data in temporalDimension invoked", inputDataObject);
    this._logger.log("Add data in temporalDimension invoked", trackedEntities);

    this.trackedEntityQueue.push(trackedEntities);
    this.trackedEntityAttributes.push(inputDataObject);
  }


  private clear():void {

  }
}
