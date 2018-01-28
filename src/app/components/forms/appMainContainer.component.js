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
var map_component_1 = require("../map/map.component");
var temporalDimension_component_1 = require("../temporal/temporalDimension.component");
var CommonResourceDispatcher_service_1 = require("../../services/dataInput/CommonResourceDispatcher.service");
var selectedDatasetManager_component_1 = require("./selectedDatasetManager.component");
var DataInputBuilder_util_1 = require("../../utils/DataInputBuilder.util");
var mapInputData_service_1 = require("../../services/dataInput/mapInputData.service");
var InputDataContent_enum_1 = require("../../enums/InputDataContent.enum");
var core_2 = require("angular2-logger/core");
var MapObjectFactory_util_1 = require("../../utils/MapObjectFactory.util");
var AppMainContainerComponent = (function () {
    function AppMainContainerComponent(_commonResourceDispatcher, _mapInputDataService, _logger) {
        var _this = this;
        this._commonResourceDispatcher = _commonResourceDispatcher;
        this._mapInputDataService = _mapInputDataService;
        this._logger = _logger;
        this.errorMessages = [];
        this.addHistoricEnrollments = false;
        this.RECIEVER_ADDRESS = mapInputData_service_1.MapInputDataService.RECEIVER_ADDRESS_APP_MAIN;
        this.dataInputBuilder = new DataInputBuilder_util_1.DataInputBuilderUtil(_logger);
        this.subscriptionInputData = this._mapInputDataService.getInputDataMessage().subscribe(function (inputDataMessage) {
            if (inputDataMessage.getReciever() === _this.RECIEVER_ADDRESS)
                _this.handleInputDataMessage(inputDataMessage);
        });
    }
    AppMainContainerComponent.prototype.ngOnInit = function () {
        var updateableComponents = [];
        updateableComponents.push(this.mapComponent);
        updateableComponents.push(this.temporalComponent);
        updateableComponents.push(this.selectedDatasetManager);
        this._commonResourceDispatcher.setUpdatableComponents(updateableComponents);
    };
    /*
     * The submitting
     */
    AppMainContainerComponent.prototype.select = function (stackData) {
        //Resetting colors and dataset id if we are not to stack data
        this.cleanUp(stackData);
        //This also generates color and dataset id in the 'createDataInputObject' function
        var dataset = this.dataInputBuilder.createDataInputObject();
        if (dataset === null) {
            alert('Unable to add another dataset');
            return;
        }
        dataset.setAddHistoricEnrollments(this.addHistoricEnrollments);
        this._commonResourceDispatcher.handleUpdate(dataset, stackData);
    };
    AppMainContainerComponent.prototype.ngOnDestroy = function () {
        this.subscriptionInputData.unsubscribe();
    };
    /*
 * Receives all map input data and store them in an inputData variable
 */
    AppMainContainerComponent.prototype.handleInputDataMessage = function (inputDataMessage) {
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
            default:
                this._logger.log('Unknown data input');
        }
        this.errorMessages = this.dataInputBuilder.validateInputObject();
    };
    AppMainContainerComponent.prototype.cleanUp = function (stackData) {
        if (!stackData) {
            DataInputBuilder_util_1.DataInputBuilderUtil.resetDatasetId();
            MapObjectFactory_util_1.MapObjectFactory.reset();
        }
    };
    return AppMainContainerComponent;
}());
__decorate([
    core_1.ViewChild(map_component_1.MapComponent),
    __metadata("design:type", map_component_1.MapComponent)
], AppMainContainerComponent.prototype, "mapComponent", void 0);
__decorate([
    core_1.ViewChild(temporalDimension_component_1.TemporalDimensionComponent),
    __metadata("design:type", temporalDimension_component_1.TemporalDimensionComponent)
], AppMainContainerComponent.prototype, "temporalComponent", void 0);
__decorate([
    core_1.ViewChild(selectedDatasetManager_component_1.SelectedDatasetManager),
    __metadata("design:type", selectedDatasetManager_component_1.SelectedDatasetManager)
], AppMainContainerComponent.prototype, "selectedDatasetManager", void 0);
AppMainContainerComponent = __decorate([
    core_1.Component({
        selector: 'app',
        templateUrl: '../../views/appMainContainer.component.html',
    })
    /*
     * This component represents the main container for all input forms that sets up the
     * initial search for the map component.
     */
    ,
    __metadata("design:paramtypes", [CommonResourceDispatcher_service_1.CommonResourceDispatcherService,
        mapInputData_service_1.MapInputDataService,
        core_2.Logger])
], AppMainContainerComponent);
exports.AppMainContainerComponent = AppMainContainerComponent;
//# sourceMappingURL=appMainContainer.component.js.map