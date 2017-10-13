import {Component, Input, OnChanges, Output} from '@angular/core';

import {ProgramsService} from '../../services/programs.service';
import {Programs} from "../../models/Programs";
import {OrganizationUnit} from "../../models/OrganizationUnit";
import {CustomValidationService} from "../../services/customValidation.service";
import {ValidationMessage} from "../../models/ValidationMessage";
import {MapInputDataService} from "../../services/mapInputData.service";
import {MapInputData} from "../../models/MapInputData";

@Component({
  selector: 'programPicker',
  templateUrl: '../../views/programs.component.html',
  providers: [ProgramsService]
})

/*
 * This component represent DHIS2 programs loaded into checkboxes in the view.
 *
 */
export class ProgramsComponent implements OnChanges{
  @Input() selectedOrgUnit: OrganizationUnit;
  programs: Programs[] = [];
  private query: string;
  private readonly senderId:string = "programPicker";

  constructor(private _progService: ProgramsService, private _customValidationService: CustomValidationService,
              private _mapInputDataService:MapInputDataService) { }

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

    this.programs = this._progService.setSelectedProgram(event, this.programs);

    let validationMessage = new ValidationMessage();
    validationMessage.senderId = this.senderId;
    validationMessage.errorMessage = this.getErrors().toString();
    validationMessage.formIsValid = (this.getErrors().length > 0 ? false : true);

    this._customValidationService.sendMessage(validationMessage);

    let mapInputData = new MapInputData(this.getSelectedPrograms(), null, null, null);
    this._mapInputDataService.sendMessage(mapInputData);
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

  private getSelectedPrograms():Programs[]{
    let selectedProgs = new Array<Programs>();
    this.programs.forEach(prog => {
      if(prog.isSelected)
        selectedProgs.push(prog);
    });
    return selectedProgs;
  }
}
