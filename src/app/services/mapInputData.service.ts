
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {MapInputData} from "../models/MapInputData";


/*
 * This service is used for sending validation messages between components
 * A issue is the ability for reuse if there are multiple observers - it runs as a singelton instance.
 */
@Injectable()
export class MapInputDataService {

  private mapInputData = new Subject<MapInputData>();

  constructor(){}

  getMapInputData():Observable<MapInputData>{
    return this.mapInputData.asObservable();
  }

  clearMapInputData(){
    this.mapInputData.next();
  }
  sendMessage(mapInputData: MapInputData){
    this.mapInputData.next(mapInputData);
  }

}
