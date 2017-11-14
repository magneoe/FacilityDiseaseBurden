import {
  Component, ComponentFactoryResolver, Input, OnChanges, OnInit, ViewChild,
  ViewContainerRef
} from '@angular/core';

import {ProgramsService} from '../../../services/dataLoading/programs.service';
import {Program} from "../../../models/Program.model";
import {OrganizationUnit} from "../../../models/OrganizationUnit.model";
import {CustomValidationService} from "../../../services/customValidation.service";
import {ValidationMessage} from "../../../models/ValidationMessage.model";
import {MapInputDataService} from "../../../services/dataInput/mapInputData.service";
import {ProgramFilterComponent} from "./programFilter.component";
import {InputDataMessage} from "../../../models/InputDataMessage.model";
import {InputDataContent} from "../../../enums/InputDataContent.enum";

@Component({
  selector: 'programPicker',
  templateUrl: '../../../views/program/program.component.html',
  providers: [ProgramsService]
})

/*
 * This component represent DHIS2 programs loaded into checkboxes in the view.
 *
 */
export class ProgramsComponent implements OnChanges, OnInit{
  @Input() selectedOrgUnit: OrganizationUnit;
  programs: Program[] = [];
  private query: string;
  private readonly senderId:string = "programPicker";
  @ViewChild('programFilterContainer', {read: ViewContainerRef}) container: ViewContainerRef;

  constructor(private _progService: ProgramsService, private _customValidationService: CustomValidationService,
              private _mapInputDataService:MapInputDataService, private _cfr:ComponentFactoryResolver) { }

  /*
   * Upon changes in the input (organisationUnit), then reload the programs
   */
  ngOnChanges(changes:any){
      this.showPrograms(this.selectedOrgUnit);
  }
  ngOnInit(){
    this.notifyValueChange(null);
  }

  /*
   * Loads the programs thats connected to a given org.unit
   */
  showPrograms(orgUnit: OrganizationUnit): void {

    if (orgUnit == null) {
      this.programs = [];
      return;
    }

    this.query = 'api/organisationUnits?filter=id:eq:' + orgUnit.id + '&fields=programs[id,displayName]&paging=0';
    this._progService.loadPrograms(this.query)
      .subscribe((units: any) => {
        this.programs = units.organisationUnits[0].programs;
        this.notifyValueChange(null);
      });
  }

  /*
   * Send a ValidationMessage upon changes in the checkbox selection
   */
  notifyValueChange(event: any): void {
    this.container.clear();
    this.programs = this._progService.setSelectedProgram(event, this.programs);

    let validationMessage = new ValidationMessage();
    validationMessage.senderId = this.senderId;
    validationMessage.errorMessage = this.getErrors().toString();
    validationMessage.formIsValid = (this.getErrors().length > 0 ? false : true);

    this._customValidationService.sendMessage(validationMessage);

    for(let i = 0; i < this.getSelectedPrograms().length; i++){
      let comp = this._cfr.resolveComponentFactory(ProgramFilterComponent);
      let filterComp = this.container.createComponent(comp);
      filterComp.instance._ref = filterComp;
      filterComp.instance.program = this.getSelectedPrograms()[i];
      filterComp.instance.selectedOrgUnit = this.selectedOrgUnit;
    }

    //Send datamessage to CommonResourceDistpatcher service.
    let inputDataMessage = new InputDataMessage(null, InputDataContent.PROGRAMS,
      this.programs.filter(prog => { return prog.isSelected}));
    this._mapInputDataService.sendInputDataMessage(inputDataMessage);
  }
  /*
   * Composes error messages
   */
  getErrors():Array<string> {
    let errors = new Array();
    for(let i = 0; i < this.programs.length; i++){
      if(this.programs[i].isSelected)
        return errors;
    }
    errors.push("No programs selected");
    return errors;
  }

  /*
   * Helper method
   */

  private getSelectedPrograms():Program[]{
    let selectedProgs = new Array<Program>();
    this.programs.forEach((prog) => {
      if(prog.isSelected)
        selectedProgs.push(prog);
    });
    return selectedProgs;
  }
}
