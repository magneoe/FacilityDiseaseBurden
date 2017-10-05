import {Component, OnDestroy} from '@angular/core';
import {CustomValidationService} from "../../services/customValidation.service";
import {Subscription} from "rxjs/Subscription";
import {ValidationMessage} from "../../models/ValidationMessage";


@Component({
  selector: 'app',
  templateUrl: 'app/views/appMainInputContainer.component.html',
})

/*
 * This component represents the main container for all input forms that sets up the
 * initial search for the map component.
 */
export class AppMainInputContainerComponent implements OnDestroy {

  formIsValid: boolean = false;
  errorMessages:Map<string, ValidationMessage> = new Map();
  subscription: Subscription;

  constructor(private _customValidationService: CustomValidationService) {
    //Subscribes to the Validation message service used by the child components for sending validation messages.
    this.subscription = this._customValidationService.getErrorMessage().subscribe(validationMessage => {
        this.handleValidationUpdateEvent(validationMessage);
    });
  }

  /*
   * This methods deals with an incomming validation message
   */
  handleValidationUpdateEvent(validationMessage: ValidationMessage){
    if(!validationMessage.formIsValid)
      this.errorMessages.set(validationMessage.senderId, validationMessage);
    else
      this.errorMessages.delete(validationMessage.senderId);

    if(this.errorMessages.size == 0)
      this.formIsValid = true;
    else
      this.formIsValid = false;
  }
  /*
   * Converts the Validation messages as an array to be iterated in the view
   */
  getErrorMessages():Array<ValidationMessage>{
    let array = new Array<ValidationMessage>();
    this.errorMessages.forEach(item =>{
      array.push(item);
    });
    return array;
  }

  /*
   * The submitting
   */
  select(): void {
    //Happy day scenario
    //let message = 'Selected orgOrg name: ' +
    //"Date range: from" + this.datePicker.getStartDate().toLocaleDateString('en-GB') + ' to: ' + this.datePicker.getEndDate().toLocaleDateString('en-GB');
    console.log('Select pushed!');
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
