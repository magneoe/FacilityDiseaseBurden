
import {Programs} from "./Programs";
import {OrganizationUnit} from "./OrganizationUnit";

export class MapInputData {

  constructor(private selectedPrograms: Programs[], private selectedOrgUnit: OrganizationUnit,
              private startDate:string, private endDate:string){}

  public getSelectedPrograms():Programs[]{
    return this.selectedPrograms;
  }
  public getSelectedOrgUnit(): OrganizationUnit {
    return this.selectedOrgUnit;
  }
  public getStartDate():string {
    return this.startDate;
  }
  public getEndDate():string {
    return this.endDate;
  }
  public setSelectedPrograms(selectedPrograms:Programs[]):void {
    this.selectedPrograms = selectedPrograms;
  }
  public setSelectedOrgUnit(selectedOrgUnit:OrganizationUnit):void {
    this.selectedOrgUnit = selectedOrgUnit;
  }
  public setStartDate(selectedStartDate:string):void {
    this.startDate = selectedStartDate;
  }
  public setEndDate(selectedEndDate:string):void {
    this.endDate = selectedEndDate;
  }
}
