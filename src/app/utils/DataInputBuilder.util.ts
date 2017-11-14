

import {FilterQuery} from "../models/FilterQuery.model";
import {OrganizationUnit} from "../models/OrganizationUnit.model";
import {Program} from "../models/Program.model";
import {Logger} from "angular2-logger/core";
import {InputDataObject} from "../models/InputDataObject.model";
import {FilterOperation} from "../enums/FilterOperation.enum";

/*
 * What: This is a builder class for constructing InputDataObjects for
 * mapcomponent and temporal component
 *
 * Why: Multiple sources (datapicker, programcomponent and organisationLoaderComponent)
 * are loosely coupled to the CommonResourceResolver, which uses this class to maintain and build inputdataObject
 * upon request.
 * The builder is a easy way to maintain the lastest incomming datas.
 */
export class DataInputBuilderUtil {

  private selectedPrograms: Program[];
  private selectedOrgUnit: OrganizationUnit;
  private startDate:string;
  private endDate:string;
  private filterQueryMap:Map<string, FilterQuery[]>;

  constructor(private _logger: Logger){
    this.filterQueryMap = new Map<string, FilterQuery[]>();
  }
  public setSelectedPrograms(selectedPrograms: Program[]): DataInputBuilderUtil {
    this.selectedPrograms = selectedPrograms;
    return this;
  }
  public setSelectedOrgUnit(selectedOrgUnit: OrganizationUnit): DataInputBuilderUtil {
    this.selectedOrgUnit = selectedOrgUnit;
    return this;
  }
  public setSelectedStartDate(selectedStartDate: string): DataInputBuilderUtil {
    this.startDate = selectedStartDate;
    return this;
  }
  public setSelectedEndDate(selectedEndDate: string): DataInputBuilderUtil {
    this.endDate = selectedEndDate;
    return this;
  }
  public setFilterQueryMap(filterQueryMap: Map<string, FilterQuery[]>): DataInputBuilderUtil {
    this.filterQueryMap = filterQueryMap;
    return this;
  }
  /*
   * Filters must be merged as the programFilterComponents are not aware of each others existence.
   */
  public mergeFilterQueries(filterQueryMap: Map<string, FilterQuery[]>): DataInputBuilderUtil {
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
    return this;
  }
  /*
   * Helper methods to 'mergeFilterQueries' function
   */
  private addFilter(filter:FilterQuery, programId:string){
    this._logger.info('Adding:', filter.toString());
    let currentFilterQueries = this.filterQueryMap.get(programId);
    if(currentFilterQueries === undefined || currentFilterQueries === null)
      currentFilterQueries = [];

    this.setFilterQueryMap(this.filterQueryMap.set(programId, currentFilterQueries.concat([filter])));
  }
  private removeFilter(filter:FilterQuery, programId:string){
    this._logger.info('Removing:', filter.toString());
    let currentFilterQueries = this.filterQueryMap.get(programId);
    if(currentFilterQueries === undefined || currentFilterQueries === null)
      return;

    let updatedFilterQueryList = [];
    for(let i = 0; i < currentFilterQueries.length; i++) {
      if(currentFilterQueries[i].toString() !== filter.toString())
        updatedFilterQueryList.push(currentFilterQueries[i]);
    }
    this.setFilterQueryMap(this.filterQueryMap.set(programId, updatedFilterQueryList));
    this._logger.info('Query List after removing:', this.filterQueryMap);
  }

  public createDataInputObject():InputDataObject {
    return new InputDataObject(this.selectedPrograms, this.selectedOrgUnit, this.startDate, this.endDate, this.filterQueryMap);
  }
}
