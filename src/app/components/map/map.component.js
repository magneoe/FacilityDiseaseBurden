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
var map_service_1 = require("../../services/map/map.service");
var core_2 = require("angular2-logger/core");
require("rxjs/add/observable/forkJoin");
var MapComponent = (function () {
    //private activeDatasets: Dataset[] = [];
    function MapComponent(_mapService, _logger) {
        this._mapService = _mapService;
        this._logger = _logger;
        this.activeDatasets = new Map();
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
    MapComponent.prototype.update = function (dataset, stackData, callOnFinish) {
        //Clears data on the map
        if (!stackData) {
            this.removeAll();
        }
        var newLayerGroup = this._mapService.loadLayerGroup(dataset, this.mapControl, L, this.map);
        this.setView(dataset);
        this.activeDatasets.set(dataset, newLayerGroup);
        callOnFinish(this);
    };
    MapComponent.prototype.delete = function (dataset, callOnFinish) {
        this._mapService.removeDataset(this.mapControl, this.map, dataset, this.activeDatasets);
        this.activeDatasets.delete(dataset);
        callOnFinish(this);
    };
    MapComponent.prototype.removeAll = function () {
        this._mapService.removeAll(this.mapControl, this.map, this.activeDatasets);
        this.activeDatasets.clear();
    };
    MapComponent.prototype.setView = function (dataset) {
        this._mapService.setView(this.map, dataset.getSelectedOrgUnit());
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