
import {Programs} from "./Program.model.";
import {OrganizationUnit} from "./OrganizationUnit.model";
import {FilterOperation, FilterQuery} from "./FilterQuery.model";

export class MapInputData {

  constructor(private selectedPrograms: Programs[], private selectedOrgUnit: OrganizationUnit,
              private startDate:string, private endDate:string, private filterQueryMap:Map<string, FilterQuery[]>){}

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
  public getFilterQueryMap():Map<string, FilterQuery[]>{
    return this.filterQueryMap;
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
  public setFilterQueriesMap(filterQueries: Map<string, FilterQuery[]>){
    this.filterQueryMap = filterQueries;
  }
  public mergeFilterQueries(filterQueryMap: Map<string, FilterQuery[]>) {
    let iterator = filterQueryMap.keys();

    filterQueryMap.forEach(filterQueries => {
      let key = iterator.next().value;
      filterQueries.forEach(filter => {
        switch (filter.getFilterOperation()) {
          case FilterOperation.ADD:
            this.addFilter(filter, key);
            break;
          case FilterOperation.REMOVE :
            this.removeFilter(filter, key);
            break;
        }
      });
    });
  }
  private addFilter(filter:FilterQuery, programId:string){
    console.log('Adding:', filter.toString());
    let currentFilterQueries = this.getFilterQueryMap().get(programId);
    if(currentFilterQueries === undefined || currentFilterQueries === null)
      currentFilterQueries = [];

    this.setFilterQueriesMap(this.filterQueryMap.set(programId, currentFilterQueries.concat([filter])));
  }
  private removeFilter(filter:FilterQuery, programId:string){
    console.log('Removing:', filter.toString());
    let currentFilterQueries = this.getFilterQueryMap().get(programId);
    if(currentFilterQueries === undefined || currentFilterQueries === null)
      return;

    let updatedFilterQueryList = [];
    for(let i = 0; i < currentFilterQueries.length; i++) {
      if(currentFilterQueries[i].toString() !== filter.toString())
        updatedFilterQueryList.push(currentFilterQueries[i]);
    }
    this.setFilterQueriesMap(this.getFilterQueryMap().set(programId, updatedFilterQueryList));
    console.log('Query List after removing:', this.getFilterQueryMap());
  }
}
