

import {Component, Input, Output} from "@angular/core";

@Component({
  selector: 'datePicker',
  template: '<p>Pick time intervall</p>' +
  '<div>' +
  '<input id="startDate" name="startDate" type="date" [ngModel]="startDate | date: dd/mm/yyyy" (ngModelChange)="startDate=$event && validate()">' +
  '<input id="endDate" name="endDate" type="date" [ngModel]="endDate | date: dd/mm/yyyy" (ngModelChange)="endDate=$event && validate()"></div>' +
  '<div>{{datePickerMessage}}</div>',
})

export class DatePickerComponent {

  startDate:Date;
  endDate:Date;
  private datePickerMessage:string = '';
  private isValid:boolean;

  constructor() { }

  ngOnInit(): void {}

  @Output()
  getStartDate():Date{
    return this.startDate;
  }
  @Output()
  getEndDate():Date{
    return this.endDate;
  }
  @Output()
  getIsValid():boolean {
    return this.isValid;
  }
  validate():void {
    this.datePickerMessage = '';
    this.isValid = true;

    if(this.startDate != null && this.endDate != null && this.endDate < this.startDate) {
      this.datePickerMessage = 'End date must be after start date!';
      this.isValid = false;
    }
    else if(this.startDate == null || this.endDate == null) {
      this.isValid = false;
      console.log("Start or end is null")
    }
    console.log("Validation:" + this.isValid + ", ");
  }

}
