import {Component} from "@angular/core";
import {Logger} from "angular2-logger/core";
import {InputDataObject} from "../../models/InputDataObject.model";
import {Observable} from "rxjs/Observable";
import {TrackedEntity} from "../../models/TrackedEntity.model";

@Component({
  selector: 'temporalComponent',
  templateUrl: '../../views/temporal.component.html',
})

export class TemporalDimensionComponent {

  private activeMapInputData: InputDataObject;
  constructor(private _logger: Logger){}

  public updateTemporalDimension(inputDataObject:InputDataObject){
      this._logger.log("UpdateTemporalDimension invoked", inputDataObject);
  }

  public addData(inputDataObject:InputDataObject, trackedEntities:Observable<TrackedEntity[]>):void{
    this._logger.log("Add data in temporalDimension invoked", inputDataObject);
    this._logger.log("Add data in temporalDimension invoked", trackedEntities);
  }

}
