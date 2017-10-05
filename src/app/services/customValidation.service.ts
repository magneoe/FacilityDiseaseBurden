import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {ValidationMessage} from "../models/ValidationMessage";
import {Subject} from "rxjs/Subject";


/*
 * This service is used for sending validation messages between components
 * A issue is the ability for reuse if there are multiple observers - it runs as a singelton instance.
 */
@Injectable()
export class CustomValidationService {
  private errorMessage = new Subject<ValidationMessage>();

  constructor(){}

  getErrorMessage():Observable<ValidationMessage>{
      return this.errorMessage.asObservable();
  }

  clearMessage(){
    this.errorMessage.next();
  }
  sendMessage(validationMessage: ValidationMessage){
    this.errorMessage.next(validationMessage);
  }
}
