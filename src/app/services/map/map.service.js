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
var GeoJSON_util_1 = require("../../utils/GeoJSON.util");
var MapObjectFactory_util_1 = require("../../utils/MapObjectFactory.util");
var core_2 = require("angular2-logger/core");
var MapObjectType_enum_1 = require("../../enums/MapObjectType.enum");
var MapService = (function () {
    function MapService(_logger) {
        this._logger = _logger;
    }
    /*
     * Initates the map and returns the reference to it
     */
    MapService.prototype.initMap = function (L, mapId) {
        var map = L.map(mapId).setView([18.4272582, 79.1575702], 5);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.dark',
            accessToken: process.env.MAPBOX_ACCESS_TOKEN
        }).addTo(map);
        return map;
    };
    MapService.prototype.setView = function (map, orgUnit) {
        var lat = orgUnit.coordinates.split(',')[0].slice(orgUnit.coordinates.search(/[0-9]/g), orgUnit.coordinates.length - 1);
        var lng = orgUnit.coordinates.split(',')[1].slice(0, orgUnit.coordinates.search(/\\]/g));
        map.panTo([lng, lat]);
    };
    /*
     * Loads one layer group to show on map - each layergroup will contain entities, polylines and a org.Unit
     * if it does not exist.
     */
    MapService.prototype.loadLayerGroup = function (selOrgUnit, selProg, trackedEntities, controls, mapData, L, map) {
        this._logger.log("Selected OrgUnit in loadLayerGroup:", selOrgUnit);
        this._logger.log("SelProg in loadLayerGroup:", selProg);
        this._logger.log("TrackedEntities in loadLayerGroup:", trackedEntities);
        var programId = selProg.id;
        //Get next available color
        var color = MapObjectFactory_util_1.MapObjectFactory.getNextAvailableColor(programId);
        //Adds all the data to map and returns the overlays to pass to the map control.
        var overlayLayers = this.addDataToMap(selOrgUnit, this.getCluster(L, color), this.getEntities(trackedEntities, L, color), L, map, mapData, color);
        //Sets up the map overlay
        this.addControlMapOverlay(selOrgUnit, selProg, overlayLayers, controls, color);
    };
    MapService.prototype.clearMap = function (controls, mapData) {
        mapData.forEach(function (item) {
            for (var i = 0; i < item.length; i++) {
                var layerGroup = item[i];
                controls.removeLayer(layerGroup);
                layerGroup.clearLayers();
            }
        });
        MapObjectFactory_util_1.MapObjectFactory.reset();
        mapData.clear();
    };
    //Makes markers based on the entities with a given color and returns them as a layer reference
    MapService.prototype.getEntities = function (trackedEntities, L, color) {
        var _this = this;
        var entityIcon = MapObjectFactory_util_1.MapObjectFactory.getMapObject(MapObjectType_enum_1.MapObjectType.ENTITY, color, L).getIcon();
        var newLayer = L.geoJSON(null, { pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: entityIcon });
            } }).bindPopup(function (layer) {
            return layer.feature.properties.popupContent;
        });
        trackedEntities.forEach(function (entity) {
            var geoJSON = GeoJSON_util_1.GeoJSONUtil.exportPointToGeo(entity.getCoords(), entity.toString());
            _this._logger.debug('Geo JSON:', geoJSON);
            if (geoJSON != null)
                newLayer.addData(geoJSON);
        });
        return newLayer;
    };
    MapService.prototype.getCluster = function (L, color) {
        //Making a new clustergroup and adding the newLayer containing all the markers inside.
        var clusterGroup = L.markerClusterGroup({
            chunkedLoading: true,
            showCoverageOnHover: true,
            iconCreateFunction: function (cluster) {
                var clusterSize = "small";
                if (cluster.getChildCount() >= 5000) {
                    clusterSize = "medium";
                }
                else if (cluster.getChildCount() >= 10000) {
                    clusterSize = "large";
                }
                var childMarkers = cluster.getAllChildMarkers();
                childMarkers.forEach(function (marker) {
                    marker.bindPopup(marker.feature.properties.popupContent);
                });
                return new L.DivIcon({
                    html: '<div><span>' + cluster.getChildCount() + '</span></div>',
                    className: 'marker-cluster marker-cluster-' + clusterSize + '-' + color.toLowerCase(),
                    iconSize: new L.Point(40, 40)
                });
            }
        });
        return clusterGroup;
    };
    MapService.prototype.getOrgUnitLayer = function (orgUnit, L, map) {
        var facilityIcon = MapObjectFactory_util_1.MapObjectFactory.getMapObject(MapObjectType_enum_1.MapObjectType.FACILITY, null, L).getIcon();
        var layer = L.geoJSON(null, { pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: facilityIcon });
            } }).bindPopup(function (layer) {
            return layer.feature.properties.popupContent;
        }).addTo(map);
        var geoJSON = GeoJSON_util_1.GeoJSONUtil.exportPointToGeo(orgUnit.coordinates, orgUnit.displayName);
        if (geoJSON != null) {
            this._logger.log("Creating org unit geojson:", geoJSON);
            layer.addData(geoJSON);
        }
        return layer;
    };
    MapService.prototype.addDataToMap = function (selectedOrgUnit, clusterGroup, entityLayer, L, map, mapData, color) {
        var polyLineLayer = null;
        var overlayLayers = new Map();
        clusterGroup.addLayer(entityLayer);
        var layerGroup = L.layerGroup().addTo(map);
        layerGroup.addLayer(clusterGroup);
        ///////////////////////Initialization of polylines////////////////////////////////////////
        var uniqueEndPoints = new Set();
        for (var key in entityLayer._layers) {
            if (clusterGroup.getVisibleParent(entityLayer._layers[key]) == null)
                continue;
            var lat = clusterGroup.getVisibleParent(entityLayer._layers[key]).getLatLng().lat;
            var lng = clusterGroup.getVisibleParent(entityLayer._layers[key]).getLatLng().lng;
            uniqueEndPoints.add(lng + "," + lat);
        }
        if (polyLineLayer != null)
            layerGroup.removeLayer(polyLineLayer);
        polyLineLayer = L.geoJSON(null, {
            style: {
                "color": color,
            }
        });
        uniqueEndPoints.forEach(function (endPoint) {
            var geoJSON = GeoJSON_util_1.GeoJSONUtil.exportPolyLineToGeo([endPoint, selectedOrgUnit.coordinates]);
            console.log('Geo JSON from polyLines:', geoJSON);
            if (geoJSON != null)
                polyLineLayer.addData(geoJSON);
        });
        layerGroup.addLayer(polyLineLayer); //New calculated polylines
        ///////////////////////END INIT POLYLINES///////////////////////////////////////
        //On zoom - remove poly lines, calculate new ones between facility and either cluster or markers.
        clusterGroup.on('animationend', function (target) {
            var uniqueEndPoints = new Set();
            for (var key in entityLayer._layers) {
                if (clusterGroup.getVisibleParent(entityLayer._layers[key]) == null)
                    continue;
                var lat = clusterGroup.getVisibleParent(entityLayer._layers[key]).getLatLng().lat;
                var lng = clusterGroup.getVisibleParent(entityLayer._layers[key]).getLatLng().lng;
                uniqueEndPoints.add(lng + "," + lat);
            }
            layerGroup.removeLayer(polyLineLayer);
            polyLineLayer = L.geoJSON(null, {
                style: {
                    "color": color,
                }
            });
            uniqueEndPoints.forEach(function (endPoint) {
                var geoJSON = GeoJSON_util_1.GeoJSONUtil.exportPolyLineToGeo([endPoint, selectedOrgUnit.coordinates]);
                console.log('Geo JSON from polyLines:', geoJSON);
                if (geoJSON != null)
                    polyLineLayer.addData(geoJSON);
            });
            layerGroup.addLayer(polyLineLayer); //New calculated polylines
        });
        if (mapData.has(selectedOrgUnit.id)) {
            mapData.get(selectedOrgUnit.id).push(layerGroup);
        }
        else {
            var orgUnitLayer = this.getOrgUnitLayer(selectedOrgUnit, L, map);
            overlayLayers.set(selectedOrgUnit.id, orgUnitLayer);
            mapData.set(selectedOrgUnit.id, [layerGroup, orgUnitLayer]);
        }
        overlayLayers.set("layerGroup", layerGroup);
        return overlayLayers;
    };
    MapService.prototype.addControlMapOverlay = function (selectedOrgUnit, selectedProgram, layerGroup, controls, color) {
        var _this = this;
        var iterator = layerGroup.keys();
        layerGroup.forEach(function (item) {
            var title = "";
            var key = iterator.next().value;
            if (selectedOrgUnit.id == key) {
                title = selectedOrgUnit.displayName;
                controls.addOverlay(layerGroup.get(key), title);
            }
            else {
                title = selectedOrgUnit.displayName + ", " + selectedProgram.displayName + "<div style='border: 1px solid black; background-color:" + color + ";width:5px;height:5px'></div>";
                controls.addOverlay(layerGroup.get(key), title);
            }
            _this._logger.log("Adding controls:", layerGroup);
        });
    };
    return MapService;
}());
MapService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_2.Logger])
], MapService);
exports.MapService = MapService;
//# sourceMappingURL=map.service.js.map