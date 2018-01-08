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
var map_service_1 = require("../../services/map/map.service");
var core_2 = require("angular2-logger/core");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/forkJoin");
var TrackedEntity_model_1 = require("../../models/TrackedEntity.model");
var MapComponent = (function () {
    function MapComponent(_mapService, _logger) {
        this._mapService = _mapService;
        this._logger = _logger;
        this.trackedEntityQueue = [];
        this.trackedEntityAttributes = [];
        this.mapData = new Map();
        this.activeMapInputData = new InputDataObject_model_1.InputDataObject(null, null, null, null, new Map());
    }
    MapComponent.prototype.ngOnInit = function () {
        var newMapContainerId = 'leafletMapId';
        // Initiates the map with a given id and the controls
        this.map = this._mapService.initMap(L, newMapContainerId);
        this.mapControl = L.control.layers().addTo(this.map);
    };
    /*
     * This runs when the input data has been changed and must be rendered.
     */
    MapComponent.prototype.update = function (inputDataObject, stackData, callOnFinish) {
        var _this = this;
        if (!stackData)
            this.clearMap();
        this.activeMapInputData = inputDataObject;
        Observable_1.Observable.forkJoin(this.trackedEntityQueue).subscribe(function (entityArray) {
            _this._logger.debug("Update map trackedEntitiy observables:", entityArray);
            var _loop_1 = function (i) {
                _this._logger.debug("Entities on program:", entityArray[i]);
                var trackedEntitiesArray = [];
                entityArray[i].trackedEntityInstances.forEach(function (unit) {
                    trackedEntitiesArray.push(new TrackedEntity_model_1.TrackedEntity(unit.attributes, unit.lastUpdated));
                });
                _this._mapService.loadLayerGroup(_this.trackedEntityAttributes[i].getSelectedOrgUnit(), _this.trackedEntityAttributes[i].getSelectedPrograms()[0], trackedEntitiesArray, _this.mapControl, _this.mapData, L, _this.map);
            };
            for (var i = 0; i < entityArray.length; i++) {
                _loop_1(i);
            }
            ;
            _this.trackedEntityAttributes = [];
            _this.trackedEntityQueue = [];
            callOnFinish(_this);
        });
    };
    MapComponent.prototype.addData = function (inputDataObject, trackedEntities) {
        this.trackedEntityQueue.push(trackedEntities);
        this.trackedEntityAttributes.push(inputDataObject);
        /*
            trackedEntities.subscribe((units: any) => {
              let trackedEntities: TrackedEntity[] = [];
              units.trackedEntityInstances.forEach((unit: TrackedEntity) => {
                trackedEntities.push(new TrackedEntity(unit.attributes, unit.lastUpdated));
              });
            });*/
    };
    MapComponent.prototype.clearMap = function () {
        this._mapService.clearMap(this.mapControl, this.mapData);
    };
    MapComponent.prototype.setView = function () {
        this._mapService.setView(this.map, this.activeMapInputData.getSelectedOrgUnit());
    };
    return MapComponent;
}());
MapComponent = __decorate([
    core_1.Component({
        selector: 'mapComponent',
        templateUrl: '../../views/map.component.html',
        providers: [map_service_1.MapService]
    })
    /*
     * This component manages the Leaflet map
     */
    ,
    __metadata("design:paramtypes", [map_service_1.MapService, core_2.Logger])
], MapComponent);
exports.MapComponent = MapComponent;
//# sourceMappingURL=map.component.js.map