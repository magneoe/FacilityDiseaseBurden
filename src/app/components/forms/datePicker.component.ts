import {Component, EventEmitter, Output} from "@angular/core";
import {ValidationComponent} from "../ValidationComponent";

@Component({
  selector: 'datePicker',
  templateUrl: 'app/views/datePicker.component.html'
})

export class DatePickerComponent extends ValidationComponent{

  startDate: string;
  endDate: string;

  @Output() validationUpdateEvent = new EventEmitter();

  notifyValueChange(event:any):void {
      this.validationUpdateEvent.emit('Message here');
  }

  isValid():Array<string> {
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
