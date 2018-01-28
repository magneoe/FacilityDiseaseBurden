"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var mapInputData_service_1 = require("../../../services/dataInput/mapInputData.service");
var FilterQuery_model_1 = require("../../../models/FilterQuery.model");
var InputDataMessage_model_1 = require("../../../models/InputDataMessage.model");
var FilterOperation_enum_1 = require("../../../enums/FilterOperation.enum");
var OperatorType_enum_1 = require("../../../enums/OperatorType.enum");
var InputDataContent_enum_1 = require("../../../enums/InputDataContent.enum");
var ProgramFilterAttributeComponent = (function () {
    function ProgramFilterAttributeComponent(_mapInputDataService) {
        this._mapInputDataService = _mapInputDataService;
        this.selectedAttribute = null;
        this.RECIEVER_ADDRESS = -1; //Default
        this.message = '';
        this.lastCommitedFilters = [];
    }
    ProgramFilterAttributeComponent.prototype.ngOnInit = function () {
        this.resetFormModel();
        this.message = '';
    };
    ProgramFilterAttributeComponent.prototype.ngOnDestroy = function () {
        if (this.lastCommitedFilters.length > 0) {
            this.lastCommitedFilters.forEach(function (filter) {
                filter.setFilterOperation(FilterOperation_enum_1.FilterOperation.REMOVE);
            });
            this.sendInputDataMessage(this.lastCommitedFilters);
        }
    };
    ProgramFilterAttributeComponent.prototype.removeObject = function () {
        this._ref.destroy();
    };
    ProgramFilterAttributeComponent.prototype.save = function () {
        //Do some validation here
        //Remove old filter, if the new one is overwritten.
        if (this.lastCommitedFilters.length > 0)
            this.ngOnDestroy();
        var filterQueries = [];
        //Text search
        if (this.formModel.fromNumberRange === 0 && this.formModel.toNumberRange === 0) {
            var operatorTypeString = this.formModel.searchType;
            if (operatorTypeString === undefined || operatorTypeString === null || operatorTypeString.length === 0) {
                this.message = 'No operator selected';
                return;
            }
            filterQueries.push(new FilterQuery_model_1.FilterQuery(this.selectedAttribute, OperatorType_enum_1.OperatorType[operatorTypeString], this.formModel.searchTextString, FilterOperation_enum_1.FilterOperation.ADD));
        }
        else {
            filterQueries.push(new FilterQuery_model_1.FilterQuery(this.selectedAttribute, OperatorType_enum_1.OperatorType.GREATER_THAN, this.formModel.fromNumberRange, FilterOperation_enum_1.FilterOperation.ADD));
            filterQueries.push(new FilterQuery_model_1.FilterQuery(this.selectedAttribute, OperatorType_enum_1.OperatorType.LESS_THAN, this.formModel.toNumberRange, FilterOperation_enum_1.FilterOperation.ADD)); //was null attribute
        }
        this.lastCommitedFilters = filterQueries;
        this.sendInputDataMessage(filterQueries);
        this.message = 'Filter is set';
    };
    ProgramFilterAttributeComponent.prototype.selectAttribute = function (selectedAttributeId) {
        if (selectedAttributeId === "null") {
            this.selectedAttribute = null;
            return;
        }
        this.selectedAttribute = this.entityAttributes.find(function (attribute) {
            if (attribute.attribute === selectedAttributeId)
                return true;
        });
        this.resetFormModel();
    };
    ProgramFilterAttributeComponent.prototype.setEntityAttributes = function (trackedEntityAttributes) {
        //Removes all attributes that are not numbers or text datatypes
        this.entityAttributes = trackedEntityAttributes.filter(function (entityAttribute) {
            if (entityAttribute.valueType !== "TEXT" && entityAttribute.valueType !== "NUMBER")
                return false;
            return true;
        });
    };
    ProgramFilterAttributeComponent.prototype.setSelectedProgram = function (selectedProgram) {
        this.selectedProgram = selectedProgram;
    };
    ProgramFilterAttributeComponent.prototype.setRecieverAddress = function (RECIEVER_ADDRESS) {
        this.RECIEVER_ADDRESS = RECIEVER_ADDRESS;
    };
    ProgramFilterAttributeComponent.prototype.resetFormModel = function () {
        this.formModel = {
            searchTextString: '',
            searchType: '',
            fromNumberRange: 0,
            toNumberRange: 0
        };
    };
    ProgramFilterAttributeComponent.prototype.sendInputDataMessage = function (filterQueries) {
        var filterQueriesMap = new Map();
        filterQueriesMap.set(this.selectedProgram.id, filterQueries);
        var inputDataMessage = new InputDataMessage_model_1.InputDataMessage(null, InputDataContent_enum_1.InputDataContent.FILTER_QUERY_MAP, filterQueriesMap, this.RECIEVER_ADDRESS);
        this._mapInputDataService.sendInputDataMessage(inputDataMessage);
    };
    return ProgramFilterAttributeComponent;
}());
ProgramFilterAttributeComponent = __decorate([
    core_1.Component({
        selector: 'programFilterAttribute',
        templateUrl: '../../../views/program/programFilterAttribute.component.html'
    }),
    __metadata("design:paramtypes", [mapInputData_service_1.MapInputDataService])
], ProgramFilterAttributeComponent);
exports.ProgramFilterAttributeComponent = ProgramFilterAttributeComponent;
//# sourceMappingURL=programFilterAttribute.component.js.map