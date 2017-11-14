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
const core_1 = require("@angular/core");
const mapInputData_service_1 = require("../../services/dataInput/mapInputData.service");
//var L = require("leaflet");
//import * as leaf from "leaflet";
//declare var leaflet :any;
let MapComponent = class MapComponent {
    constructor(_mapInputDataService) {
        this._mapInputDataService = _mapInputDataService;
        //Subscribes to the Validation message service used by the child components for sending validation messages.
        this.subscription = this._mapInputDataService.getMapInputData().subscribe(mapInputData => {
            this.handleMapInputDataEvent(mapInputData);
        });
        //console.log('Leaflet:', leaf.toString());
    }
    /*
     * Receives all map input data and store them in mapInputData variable
     */
    handleMapInputDataEvent(mapInputData) {
        if (this.mapInputData == null) {
            this.mapInputData = mapInputData;
            return;
        }
        if (mapInputData.getSelectedPrograms() != null)
            this.mapInputData.setSelectedPrograms(mapInputData.getSelectedPrograms());
        if (mapInputData.getSelectedOrgUnit() != null)
            this.mapInputData.setSelectedOrgUnit(mapInputData.getSelectedOrgUnit());
        if (mapInputData.getStartDate() != null && mapInputData.getEndDate() != null) {
            this.mapInputData.setStartDate(mapInputData.getStartDate());
            this.mapInputData.setEndDate(mapInputData.getEndDate());
        }
    }
};
MapComponent = __decorate([
    core_1.Component({
        selector: 'mapComponent',
        templateUrl: '../../views/map.component.html',
    }),
    __metadata("design:paramtypes", [mapInputData_service_1.MapInputDataService])
], MapComponent);
exports.MapComponent = MapComponent;
//# sourceMappingURL=map.component.js.map
