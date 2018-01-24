

import {Component, EventEmitter, OnDestroy, OnInit, Output} from "@angular/core";
import {TrackedEntityAttribute} from "../../../models/TrackedEntityAttribute.model";
import {MapInputDataService} from "../../../services/dataInput/mapInputData.service";
import {FilterQuery} from "../../../models/FilterQuery.model";
import {Program} from "../../../models/Program.model";
import {InputDataMessage} from "../../../models/InputDataMessage.model";
import {FilterOperation} from "../../../enums/FilterOperation.enum";
import {OperatorType} from "../../../enums/OperatorType.enum";
import {InputDataContent} from "../../../enums/InputDataContent.enum";

@Component({
  selector: 'programFilterAttribute',
  templateUrl: '../../../views/program/programFilterAttribute.component.html'
})


export class ProgramFilterAttributeComponent implements OnInit, OnDestroy {
  _ref:any;
  entityAttributes: TrackedEntityAttribute[];
  selectedAttribute:TrackedEntityAttribute = null;
  RECIEVER_ADDRESS:number = -1; //Default
  message:string = '';

  selectedProgram: Program;
  formModel:any;
  private lastCommitedFilters:FilterQuery[] = [];

  constructor(private _mapInputDataService:MapInputDataService){}
  ngOnInit(){
      this.resetFormModel();
      this.message = '';
  }
  ngOnDestroy(){
    if(this.lastCommitedFilters.length > 0){
      this.lastCommitedFilters.forEach((filter:FilterQuery) => {
        filter.setFilterOperation(FilterOperation.REMOVE);
      });
      this.sendInputDataMessage(this.lastCommitedFilters);
    }
  }
  removeObject(){
    this._ref.destroy();
  }

  save(){
    //Do some validation here

    //Remove old filter, if the new one is overwritten.
    if(this.lastCommitedFilters.length > 0)
      this.ngOnDestroy();


    let filterQueries:FilterQuery[] = [];
    //Text search
    if(this.formModel.fromNumberRange === 0 && this.formModel.toNumberRange === 0){
      let operatorTypeString = this.formModel.searchType as keyof typeof OperatorType;
      if(operatorTypeString === undefined || operatorTypeString === null || operatorTypeString.length === 0)
      {
        this.message = 'No operator selected';
        return;
      }
      filterQueries.push(new FilterQuery(this.selectedAttribute, OperatorType[operatorTypeString], this.formModel.searchTextString, FilterOperation.ADD));
    }
    //Number intervall
    else {
      filterQueries.push(new FilterQuery(this.selectedAttribute, OperatorType.GREATER_THAN, this.formModel.fromNumberRange, FilterOperation.ADD));
      filterQueries.push(new FilterQuery(this.selectedAttribute, OperatorType.LESS_THAN, this.formModel.toNumberRange, FilterOperation.ADD)); //was null attribute
    }
    this.lastCommitedFilters = filterQueries;
    this.sendInputDataMessage(filterQueries);
    this.message = 'Filter is set';
  }
  selectAttribute(selectedAttributeId:string){
    if(selectedAttributeId === "null")
    {
      this.selectedAttribute = null;
      return;
    }
      this.selectedAttribute = this.entityAttributes.find((attribute:TrackedEntityAttribute) => {
        if(attribute.attribute === selectedAttributeId)
          return true;
      });
    this.resetFormModel();
  }

  setEntityAttributes(trackedEntityAttributes:TrackedEntityAttribute[]) {
    //Removes all attributes that are not numbers or text datatypes
    this.entityAttributes = trackedEntityAttributes.filter((entityAttribute:TrackedEntityAttribute) => {
      if(entityAttribute.valueType !== "TEXT" && entityAttribute.valueType !== "NUMBER")
        return false;
      return true;
    });
  }
  setSelectedProgram(selectedProgram:Program){
    this.selectedProgram = selectedProgram;
  }
  setRecieverAddress(RECIEVER_ADDRESS:number):void {
    this.RECIEVER_ADDRESS = RECIEVER_ADDRESS;
  }

  private resetFormModel(){
    this.formModel = {
      searchTextString: '',
      searchType:'',
      fromNumberRange:0 ,
      toNumberRange:0
    };
  }
  private sendInputDataMessage(filterQueries:FilterQuery[]) {
    let filterQueriesMap:Map<string, FilterQuery[]> = new Map<string, FilterQuery[]>();
    filterQueriesMap.set(this.selectedProgram.id ,filterQueries);

    let inputDataMessage = new InputDataMessage(null, InputDataContent.FILTER_QUERY_MAP, filterQueriesMap, this.RECIEVER_ADDRESS);
    this._mapInputDataService.sendInputDataMessage(inputDataMessage);

  }
}
