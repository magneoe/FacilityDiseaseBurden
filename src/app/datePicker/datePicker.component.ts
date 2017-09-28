

import {Component, Input, Output} from "@angular/core";

@Component({
  selector: 'datePicker',
  template: '<p>Pick time intervall</p>' +
  '<div>' +
  '<input id="startDate" name="startDate" type="date" [ngModel]= "startDate | date:\'yyyy-MM-dd\'" (ngModelChange)="setStartDate($event)">' +
  '<input id="endDate" name="endDate" type="date" [ngModel]= "endDate | date:\'yyyy-MM-dd\'" (ngModelChange)="setEndDate($event)"></div>',
})

export class DatePickerComponent {

  startDate:Date;
  endDate:Date;
  private datePickerMessage:string = '';
  private isValid:boolean = false;

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
    this.validate();
    return this.isValid;
  }
  setStartDate($event):void{
    let startDate = event.target.value;
    console.log("Start date as string:", startDate);
    if(startDate != null && startDate !== undefined){
      this.startDate = new Date(startDate);
    }
  }
  setEndDate($event):void{
    let endDate = event.target.value;
    if(endDate != null && endDate !== undefined){
      this.endDate = new Date(endDate);
    }
  }
  getDatePickerMessage():string {
    return this.datePickerMessage;
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
      this.datePickerMessage = "Start or end date is not set";
    }
    console.log("Validation:" + this.isValid + ", ");
  }

}
