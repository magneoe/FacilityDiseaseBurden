
import {Dataset} from "../models/Dataset.model";

export interface IUpdateableComponent {
  update(dataset:Dataset, stackData:boolean, callOnFinish:any):any;
  delete(dataset:Dataset, callOnFinish:any):void;
}
