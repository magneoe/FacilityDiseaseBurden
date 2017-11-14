
import {Program} from "./Program.model";
import {OrganizationUnit} from "./OrganizationUnit.model";
import {FilterQuery} from "./FilterQuery.model";

export class InputDataObject {


  constructor(private selectedPrograms: Program[], private selectedOrgUnit: OrganizationUnit,
              private startDate:string, private endDate:string, private filterQueryMap:Map<string, FilterQuery[]>){}

  public getSelectedPrograms():Program[]{
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
  public getFilterQueryMap():Map<string, FilterQuery[]>{
    return this.filterQueryMap;
  }
  public setSelectedPrograms(selectedPrograms:Program[]):void {
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
  public setFilterQueriesMap(filterQueries: Map<string, FilterQuery[]>){
    this.filterQueryMap = filterQueries;
  }
  public equals(inputDataObject:InputDataObject):boolean {

    if(inputDataObject.getStartDate() !== this.getStartDate())
      return false;
    if(inputDataObject.getEndDate() !== this.getEndDate())
      return false;
    if(inputDataObject.getSelectedOrgUnit().id !== this.getSelectedOrgUnit().id)
      return false;
    for(let i = 0; i < this.getSelectedPrograms().length; i++){
      if(inputDataObject.getSelectedPrograms()[i].id !== this.getSelectedPrograms()[i].id)
        return false;
    }
    let iterator = inputDataObject.getFilterQueryMap().keys();
    inputDataObject.getFilterQueryMap().forEach(value => {
      let key = iterator.next();
      if(!this.getFilterQueryMap().has(key.value))
        return false;
    });
    return true;
  }
}

