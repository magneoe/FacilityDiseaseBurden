

import {TrackedEntity} from "../models/TrackedEntity.model";
import {Observable} from "rxjs/Observable";
import {InputDataObject} from "../models/InputDataObject.model";

export interface IUpdateableComponent {
  addData(inputDataObject:InputDataObject, trackedEntities:Observable<TrackedEntity[]>);
  update(inputDataObject:InputDataObject, callOnFinish:any);
}
