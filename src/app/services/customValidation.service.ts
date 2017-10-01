

import {Injectable} from "@angular/core";
import {ValidationComponent} from "../components/ValidationComponent";

@Injectable()
export class CustomValidationService {

  constructor(){}


  validateComponents(validationChildren:Array<ValidationComponent>): Array<string>{
    let errorMessages = new Array();

    validationChildren.forEach((child) => {
      errorMessages = errorMessages.concat(child.isValid());
    });
    return errorMessages;
  }
}
