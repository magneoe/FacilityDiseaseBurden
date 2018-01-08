

import {TrackedEntity} from "../models/TrackedEntity.model";
import {Observable} from "rxjs/Observable";
import {InputDataObject} from "../models/InputDataObject.model";

export interface IUpdateableComponent {
  addData(inputDataObject:InputDataObject, trackedEntities:Observable<TrackedEntity[]>):any;
  update(inputDataObject:InputDataObject, stackData:boolean, callOnFinish:any):any;
}
