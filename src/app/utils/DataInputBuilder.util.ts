

import {FilterQuery} from "../models/FilterQuery.model";
import {OrganizationUnit} from "../models/OrganizationUnit.model";
import {Program} from "../models/Program.model";
import {Logger} from "angular2-logger/core";
import {FilterOperation} from "../enums/FilterOperation.enum";
import {MapObjectFactory} from "./MapObjectFactory.util";
import {Dataset} from "../models/Dataset.model";

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

  private selectedPrograms: Program[]; //Mandatory field
  private selectedOrgUnit: OrganizationUnit; //Mandatory field
  private startDate:string; //Mandatory field
  private endDate:string; //Mandatory field
  private filterQueryMap:Map<string, FilterQuery[]>;

  private static datasetId:number = 0;

  constructor(private _logger: Logger) {
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
  public validateInputObject(): string[] {
    let errorMessages:string[] = [];
    if(this.selectedOrgUnit === null || this.selectedOrgUnit === undefined)
      errorMessages.push('Selected organisation unit not set');
    if(this.startDate === null || this.startDate === undefined)
        errorMessages.push('Start date not set');
    if(this.endDate === null || this.endDate === undefined)
      errorMessages.push('End date not set');
    if(this.selectedPrograms === null || this.selectedPrograms === undefined ||
        this.selectedPrograms.length === 0 || this.selectedPrograms[0] === null ||
    this.selectedPrograms[0] === undefined)
      errorMessages.push('Program not set');
    return errorMessages;
  }

  public createDataInputObject():Dataset {
    let newColor = MapObjectFactory.getNewColor();
    if(newColor === null)
      return null;

    let datasetId = DataInputBuilderUtil.datasetId++;
    let programsClone:Program[] = this.selectedPrograms.concat([]);
    let orgUnitClone:OrganizationUnit = {...this.selectedOrgUnit};
    let startDateClone:string = this.startDate + '';
    let endDateClone:string = this.endDate + '';
    let filterQueryMapClone:Map<string, FilterQuery[]> = new Map();
    this.filterQueryMap.forEach((filterQueries:FilterQuery[], key:string) => {
        let filterQueryClones:FilterQuery[] = [];
        filterQueries.forEach((filterQuery:FilterQuery) => {
            filterQueryClones.push(filterQuery.clone());
        });
        filterQueryMapClone.set('' + key, filterQueryClones);
    });

    return new Dataset(
       datasetId, newColor, programsClone,
        orgUnitClone, startDateClone, endDateClone, filterQueryMapClone);
  }
  public static resetDatasetId():void {
    DataInputBuilderUtil.datasetId = 0;
  }

}
