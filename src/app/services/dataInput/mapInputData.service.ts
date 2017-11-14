
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {InputDataMessage} from "../../models/InputDataMessage.model";


/*
 * This service is used for sending validation messages between components
 * A issue is the ability for reuse if there are multiple observers - it runs as a singelton instance.
 */
@Injectable()
export class MapInputDataService {

  private inputDataMessage = new Subject<InputDataMessage>();

  constructor(){}

  getInputDataMessage():Observable<InputDataMessage>{
    return this.inputDataMessage.asObservable();
  }

  clearInputDataMessage(){
    this.inputDataMessage.next();
  }
  sendInputDataMessage(inputDataMessage: InputDataMessage){
    this.inputDataMessage.next(inputDataMessage);
  }

}
