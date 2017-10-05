import {Component} from "@angular/core";
import {CustomValidationService} from "../../services/customValidation.service";
import {ValidationMessage} from "../../models/ValidationMessage";

@Component({
  selector: 'datePicker',
  templateUrl: 'app/views/datePicker.component.html',
})

/*
 * This component represents a datepicking form.
 */
export class DatePickerComponent{

  private readonly senderId:string = "datePicker";
  startDate: string;
  endDate: string;

  constructor(private _customValidationService: CustomValidationService){}

  ngOnInit(){
    this.notifyValueChange(null);
  }

  /*
   * Upon any event in the view (picking dates) this methods is called
   */
  notifyValueChange(event:any):void {

    let validationMessage = new ValidationMessage();
    validationMessage.senderId = this.senderId;
    validationMessage.errorMessage = this.getErrors().toString();
    validationMessage.formIsValid = (this.getErrors().length > 0 ? false : true);

    this._customValidationService.sendMessage(validationMessage);
  }
  /*
   * A local validation method - composing the errors
   */
  getErrors():Array<string> {
   let errors = new Array();

   if(this.startDate == null || this.startDate === undefined)
     errors.push('Start date not set');
   if(this.endDate == null || this.endDate === undefined)
      errors.push('End date not set');
   if(this.startDate != null && this.endDate != null && this.startDate > this.endDate)
     errors.push('End date must be after startdate');

   console.log('errors:', errors);
   return errors;
  }
}
