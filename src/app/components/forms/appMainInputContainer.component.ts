import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {CustomValidationService} from "../../services/customValidation.service";
import {DatePickerComponent} from "./datePicker.component";
import {OrganizationLoaderComponent} from "./organizationLoader.component";
import {ValidationComponent} from "../ValidationComponent";



@Component({
  selector: 'app',
  templateUrl: 'app/views/appMainInputContainer.component.html',
  providers: [CustomValidationService],
})

export class AppMainInputContainerComponent implements AfterViewInit {

  formIsValid: boolean = false;
  errorMessages:Array<string> = new Array();
  inputValidationComps: Array<ValidationComponent> = [];

  @ViewChild(DatePickerComponent) datePicker: DatePickerComponent;
  @ViewChild(OrganizationLoaderComponent) orgLoader: OrganizationLoaderComponent;

  constructor(private _customValidationService: CustomValidationService) { }

  ngAfterViewInit(){
    this.inputValidationComps.push(this.datePicker);
    this.inputValidationComps.push(this.orgLoader);
  }

  handleValidationUpdateEvent(message:any){
    this.errorMessages = this._customValidationService.validateComponents(this.inputValidationComps);
    if(this.errorMessages.length == 0)
      this.formIsValid = true;
    else
      this.formIsValid = false;
  }

  select(): void {
    //Happy day scenario
    //let message = 'Selected orgOrg name: ' +
    //"Date range: from" + this.datePicker.getStartDate().toLocaleDateString('en-GB') + ' to: ' + this.datePicker.getEndDate().toLocaleDateString('en-GB');
    console.log('Select pushed!');
  }
}
