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
var InputDataObject_model_1 = require("../../models/InputDataObject.model");
var DataInputBuilder_util_1 = require("../../utils/DataInputBuilder.util");
var organizationUnitLoader_service_1 = require("../dataLoading/organizationUnitLoader.service");
var mapInputData_service_1 = require("./mapInputData.service");
var core_2 = require("angular2-logger/core");
var TrackedEntityLoaderService_service_1 = require("../dataLoading/TrackedEntityLoaderService.service");
var InputDataContent_enum_1 = require("../../enums/InputDataContent.enum");
var CommonResourceDispatcherService = (function () {
    function CommonResourceDispatcherService(_mapInputDataService, _organisationLoaderService, _logger, _trackedEntityLoaderService) {
        var _this = this;
        this._mapInputDataService = _mapInputDataService;
        this._organisationLoaderService = _organisationLoaderService;
        this._logger = _logger;
        this._trackedEntityLoaderService = _trackedEntityLoaderService;
        this.dataInputBuilder = new DataInputBuilder_util_1.DataInputBuilderUtil(_logger);
        // Subscribes to the Validation message service used by the child components for sending validation messages.
        this.subscription = this._mapInputDataService.getInputDataMessage().subscribe(function (inputDataMessage) {
            _this.handleInputDataMessage(inputDataMessage);
        });
    }
    CommonResourceDispatcherService.prototype.handleUpdate = function (updateableComponents, callOnFinish) {
        var _this = this;
        var inputDataObject = this.dataInputBuilder.createDataInputObject();
        this._logger.debug('InpudataObject in handleUpdate', inputDataObject);
        this.getOrgUnitChildern(inputDataObject).subscribe(function (units) {
            //Need to resolve all subunits connected to the program (if any) - saves resources by performing the task after the form is submitted
            _this._logger.log('AddDataToMap query:', units);
            var orgUnitsToMap = units.organisationUnits.filter(function (orgUnit) {
                if (orgUnit.ChildCount === 0 && orgUnit.coordinates !== undefined)
                    return true;
                return false;
            });
            if (orgUnitsToMap === null || orgUnitsToMap.length === 0)
                orgUnitsToMap = [inputDataObject.getSelectedOrgUnit()];
            _this._logger.debug('OrgUnit array to send for mapping:', orgUnitsToMap);
            /*
             * For each selected programs one single layer group is being loaded,
             * containing all the markers and polyfigures connected to the program.
             */
            for (var selOrgIndex = 0; selOrgIndex < orgUnitsToMap.length; selOrgIndex++) {
                var _loop_1 = function (selProgIndex) {
                    var trackedEntities = _this._trackedEntityLoaderService.getTrackedEntityInstancesByQuery(orgUnitsToMap[selOrgIndex], inputDataObject.getSelectedPrograms()[selProgIndex], inputDataObject.getStartDate(), inputDataObject.getEndDate(), inputDataObject.getFilterQueryMap());
                    var localInputDataObj = new InputDataObject_model_1.InputDataObject(inputDataObject.getSelectedPrograms(), inputDataObject.getSelectedOrgUnit(), inputDataObject.getStartDate(), inputDataObject.getEndDate(), inputDataObject.getFilterQueryMap());
                    localInputDataObj.setSelectedOrgUnit(orgUnitsToMap[selOrgIndex]);
                    localInputDataObj.setSelectedPrograms([inputDataObject.getSelectedPrograms()[selProgIndex]]);
                    /*if(mapComponent !== null) {
                      mapComponent.addData(localInputDataObj,trackedEntities);
                    }
                    if(temporalComponent !== null){
                      temporalComponent.addData(localInputDataObj, trackedEntities);
                    }*/
                    updateableComponents.forEach(function (comp) {
                        if (comp !== null)
                            comp.addData(localInputDataObj, trackedEntities);
                    });
                };
                for (var selProgIndex = 0; selProgIndex < inputDataObject.getSelectedPrograms().length; selProgIndex++) {
                    _loop_1(selProgIndex);
                }
            }
            updateableComponents.forEach(function (comp) {
                if (comp !== null)
                    comp.update(inputDataObject, callOnFinish);
            });
            /*
            if(mapComponent != null)
              mapComponent.update(inputDataObject, callOnFinish);
            if(temporalComponent != null)
              temporalComponent.update(inputDataObject, callOnFinish);
              */
        });
    };
    /*
     * Receives all map input data and store them in mapInputData variable
     */
    CommonResourceDispatcherService.prototype.handleInputDataMessage = function (inputDataMessage) {
        var dataContent = inputDataMessage.getDataContent();
        switch (dataContent) {
            case InputDataContent_enum_1.InputDataContent.ORG_UNIT:
                this.dataInputBuilder.setSelectedOrgUnit(inputDataMessage.getPayload());
                break;
            case InputDataContent_enum_1.InputDataContent.PROGRAMS:
                this.dataInputBuilder.setSelectedPrograms(inputDataMessage.getPayload());
                break;
            case InputDataContent_enum_1.InputDataContent.END_DATE:
                this.dataInputBuilder.setSelectedEndDate(inputDataMessage.getPayload());
                break;
            case InputDataContent_enum_1.InputDataContent.START_DATE:
                this.dataInputBuilder.setSelectedStartDate(inputDataMessage.getPayload());
                break;
            case InputDataContent_enum_1.InputDataContent.FILTER_QUERY_MAP:
                this.dataInputBuilder.mergeFilterQueries(inputDataMessage.getPayload());
                break;
        }
    };
    CommonResourceDispatcherService.prototype.getOrgUnitChildern = function (inputDataModel) {
        if (inputDataModel === null || inputDataModel.getSelectedOrgUnit() === null ||
            inputDataModel.getSelectedPrograms() === null) {
            //Do some errorHandling
            return;
        }
        return this._organisationLoaderService.getOrgUnits('api/organisationUnits?fields=[id,displayName,level,coordinates,' +
            'children::size~rename(ChildCount)]&paging=0&filter=ancestors.id:eq:' + inputDataModel.getSelectedOrgUnit().id);
    };
    return CommonResourceDispatcherService;
}());
CommonResourceDispatcherService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [mapInputData_service_1.MapInputDataService, organizationUnitLoader_service_1.OrganizationUnitLoaderService,
        core_2.Logger, TrackedEntityLoaderService_service_1.TrackedEntityLoaderService])
], CommonResourceDispatcherService);
exports.CommonResourceDispatcherService = CommonResourceDispatcherService;
//# sourceMappingURL=CommonResourceDispatcher.service.js.map