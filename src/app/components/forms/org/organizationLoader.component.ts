import {Component} from '@angular/core';
import {OrganizationUnitLoaderService} from "../../../services/dataLoading/organizationUnitLoader.service";
import {OrderByDisplayNamePipe} from "../../../pipes/organizationLoader.pipe";
import {OrganizationUnit} from "../../../models/OrganizationUnit.model";
import {ProgramsComponent} from "../program/program.component";
import {ValidationMessage} from "../../../models/ValidationMessage.model";
import {CustomValidationService} from "../../../services/customValidation.service";
import {MapInputDataService} from "../../../services/dataInput/mapInputData.service";
import {InputDataMessage} from "../../../models/InputDataMessage.model";
import {InputDataContent} from "../../../enums/InputDataContent.enum";



@Component({
  selector: 'organisationPicker',
  templateUrl: '../../../views/organizationLoader.component.html',
  providers: [OrganizationUnitLoaderService, OrderByDisplayNamePipe, ProgramsComponent]
})

/*
 * This component represent the loading of organisation units from the hiarcky
 * manifested in a multi level drop down list in the view.
 */

export class OrganizationLoaderComponent {
  organizationUnits: OrganizationUnit[];
  private query:string;
  private levels: number[] = [1];
  isLoading:boolean = false;
  selectedOrgUnit: OrganizationUnit;
  private readonly senderId:string = "organisationPicker";

  constructor(private _orgLoaderService: OrganizationUnitLoaderService,
              private _customValidationService:CustomValidationService,
              private _mapInputDataService:MapInputDataService) { }

  /*
   * When ever at change in the picking of organisation units - revalidate the form and notice the master component.
   */
  notifyValueChange(event:any):void {
    let validationMessage = new ValidationMessage();
    validationMessage.senderId = this.senderId;
    validationMessage.errorMessage = this.getErrors().toString();
    validationMessage.formIsValid = (this.getErrors().length > 0 ? false : true);

    this._customValidationService.sendMessage(validationMessage);

    let inputDataMessage = new InputDataMessage(null, InputDataContent.ORG_UNIT, this.selectedOrgUnit);
    this._mapInputDataService.sendInputDataMessage(inputDataMessage);
  }
  /*
   * Loading the root level in the hiarcky
   */
  ngOnInit(): void {
    this.isLoading = true;
    this._orgLoaderService.getOrgUnits('api/organisationUnits?level=1&paging=0&fields=id,displayName,level')
      .subscribe((units:any) => {
        this.organizationUnits = units.organisationUnits});
    this.isLoading = false;
    this.notifyValueChange(null);
  }

  /*
   * Loads a designated level, on the basis of a given ancestor id.
   */
  loadLevel(ancestorId : string, lvl : number) : void {
    this.isLoading = true;
    //Fetch the particular ancestor from the array
    this.selectedOrgUnit = this._orgLoaderService.findSelectedOrgUnit(ancestorId, this.organizationUnits);
    //Re-arranging the levels
    this.levels = this._orgLoaderService.setLevel(this.selectedOrgUnit, lvl, this.levels, this.organizationUnits);

    //Loading children of the ancestor - if there is one or if its been loaded previously.
    if(this.selectedOrgUnit != null) {
      this.query = 'api/organisationUnits?filter=id:eq:' + ancestorId + '&fields=children[id,displayName,level,coordinates]&paging=0';
      this._orgLoaderService.getOrgUnits(this.query)
        .subscribe((units: any) => {
        //Loads the children of the ancestor
          this.selectedOrgUnit.children = units.organisationUnits[0].children;
          //If there are any children - we need to add another level/drop down list in the view
          if (this.selectedOrgUnit.children.length > 0)
            this.levels.push(this.levels.length + 1);
        });
    }
    //If we are clicking 'Choose level x' - we need to set back the selected org unit to the previous level
    else if(lvl > 1) {
      this.selectedOrgUnit = this._orgLoaderService.findSelectOrgUnitAtGivenLevel(lvl-1, this.levels.length, this.organizationUnits);
    }
    this.isLoading = false;
    this.notifyValueChange(null);
  }

  /*
   * Gets children of on a particular level
   */
  findChildrenOfSelectedOrgUnit(lvl:number): OrganizationUnit[]{
    return this._orgLoaderService.findChildrenOfSelectedOrgUnit(lvl, this.levels.length, this.organizationUnits);
  }
  /*
   * Used for composing the validation message
   */
  getErrors():Array<string> {
    let errorMessages = new Array();
    if(this.selectedOrgUnit == null) {
      errorMessages.push("OrgUnit not set");
    }
    return errorMessages;
  }
}
