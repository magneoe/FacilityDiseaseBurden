import {Injectable} from '@angular/core';
import {OrganizationUnit} from "../../models/OrganizationUnit.model";
import {GeoJSONUtil} from "../../utils/GeoJSON.util";
import {Program} from "../../models/Program.model";
import {MapObjectFactory} from "../../utils/MapObjectFactory.util";
import {TrackedEntity} from "../../models/TrackedEntity.model";
import {Logger} from "angular2-logger/core";
import {MapObjectType} from "../../enums/MapObjectType.enum";
import {Dataset} from "../../models/Dataset.model";


@Injectable()
export class MapService {

    constructor(private _logger: Logger) {
    }

    /*
     * Initates the map and returns the reference to it
     */
    public initMap(L: any, mapId: string): any {
        let map = L.map(mapId, {
            fullscreenControl: true,
            fullscreenControlOptions: {
                position: 'topleft'
            }
        }).setView([18.4272582, 79.1575702], 5);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.dark',
            accessToken: process.env.MAPBOX_ACCESS_TOKEN
        }).addTo(map);
        return map;
    }

    public setView(map: any, orgUnit: OrganizationUnit, L: any): void {
        let convertedCoord: any = GeoJSONUtil.convertCoordinates(orgUnit.coordinates, L);
        orgUnit.convertedCoord = convertedCoord;
        if (convertedCoord === null)
            return;
        try {
            map.panTo([convertedCoord.lng, convertedCoord.lat]);
        } catch (error) {
            this._logger.log('Error', error);
        }
    }

    public removeAll(controls: any, map: any, activeLayerGroups: Map<Dataset, any>) {
        this._logger.log('Clear map:', map);
        activeLayerGroups.forEach((activeLayerGroup: any, dataset: Dataset) => {
            map.removeLayer(activeLayerGroup);
            controls.removeLayer(activeLayerGroup);
        });
    }

    public removeDataset(controls: any, map: any, dataset: Dataset, activeLayerGroups: Map<Dataset, any>): void {
        let datasetLayerGroupToRemove = activeLayerGroups.get(dataset);
        map.removeLayer(datasetLayerGroupToRemove);
        controls.removeLayer(datasetLayerGroupToRemove);
    }

    /*
     * Loads one layer group to show on map - each layergroup will contain entities, polylines and a org.Unit
     * if it does not exist.
     */
    public loadLayerGroup(dataset: Dataset,
                          controls: any,
                          L: any,
                          map: any) {
        this._logger.log("Selected OrgUnit in loadLayerGroup:", dataset.getSelectedOrgUnit());
        this._logger.log("SelProg in loadLayerGroup:", dataset.getSelectedPrograms());

        let color = dataset.getColor();
        let layerGroupToMap = L.layerGroup().addTo(map);
        dataset.getTrackedEntityResults().forEach((trackedEntities: TrackedEntity[], orgUnit: OrganizationUnit) => {
            orgUnit.convertedCoord = GeoJSONUtil.convertCoordinates(orgUnit.coordinates, L);
            this._logger.log('Loading data set convert coords', orgUnit.convertedCoord);
            //Adds all the data to map and returns the overlays to pass to the map control.

            let trackedEntityLayer = this.getEntities(trackedEntities, dataset.getAddHistoricEnrollments(), L, color);
            let clusterLayer = this.getCluster(L, color);
            let orgUnitLayer = this.getOrgUnitLayer(orgUnit, L);

            //The polylines needs to be added last
            let polylineLayer = this.addDataToMap(layerGroupToMap, orgUnit, clusterLayer, trackedEntityLayer, orgUnitLayer,
                L, color);
        });

        this.addControlMapOverlay(layerGroupToMap, dataset, controls, color);
        return layerGroupToMap;
    }

    private addDataToMap(layerGroupToMap: any, selectedOrgUnit: OrganizationUnit, clusterGroup: any, entityLayer: any, orgUnitLayer: any,
                         L: any, color: string): any {
        clusterGroup.addLayer(entityLayer);
        layerGroupToMap.addLayer(clusterGroup);
        layerGroupToMap.addLayer(orgUnitLayer);

        let polylineLayer = this.getPolylines(entityLayer, clusterGroup, L, color, selectedOrgUnit);
        layerGroupToMap.addLayer(polylineLayer);


        //On zoom - remove poly lines, calculate new ones between facility and either cluster or markers.
        clusterGroup.on('animationend', function (target: any) {
            console.log('Rendering clusters');
            let uniqueEndPoints = new Set<any>();
            for (var key in entityLayer._layers) {
                if (clusterGroup.getVisibleParent(entityLayer._layers[key]) == null)
                    continue;
                let lat: string = clusterGroup.getVisibleParent(entityLayer._layers[key]).getLatLng().lat;
                let lng: string = clusterGroup.getVisibleParent(entityLayer._layers[key]).getLatLng().lng;
                uniqueEndPoints.add(GeoJSONUtil.convertCoordinates(lng + "," + lat, L));
            }
            if (polylineLayer !== null)
                layerGroupToMap.removeLayer(polylineLayer);
            polylineLayer = L.geoJSON(null, {
                style: {
                    "color": color,
                }
            });
            uniqueEndPoints.forEach(endPoint => {
                let geoJSON = GeoJSONUtil.exportPolyLineToGeo([endPoint, selectedOrgUnit.convertedCoord]);
                if (geoJSON != null)
                    polylineLayer.addData(geoJSON);
                else
                    this._logger.log('Not a valid polyline element', endPoint);
            });
            layerGroupToMap.addLayer(polylineLayer); //New calculated polylines
        });

        return polylineLayer;
    }

    //Makes markers based on the entities with a given color and returns them as a layer reference
    private getEntities(trackedEntities: TrackedEntity[], addHistoricEnrollments:boolean, L: any, color: string): any {
        var entityIcon = MapObjectFactory.getMapObject(MapObjectType.ENTITY, color, L).getIcon();
        let entityLayer = L.geoJSON(null, {
            pointToLayer: function (feature: any, latlng: any) {
                return L.marker(latlng, {icon: entityIcon});
            }
        }).bindPopup(function (layer: any) {
            return layer.feature.properties.popupContent;
        });
        trackedEntities.forEach((entity: TrackedEntity) => {
            for(let i = 0; i < entity.getEnrollments().length; i++) {
                if (!addHistoricEnrollments && i > 0) //Assume that the first element is the most recent enrollment
                    continue;
                entity.convertedCoords = GeoJSONUtil.convertCoordinates(entity.getCoords(), L);
                let geoJSON = GeoJSONUtil.exportPointToGeo(entity.convertedCoords, entity.toString());
                if (geoJSON != null)
                    entityLayer.addData(geoJSON);
                else
                    this._logger.log('Not a valid entity:', entity);
            }
        });
        return entityLayer;
    }

    private getCluster(L: any, color: string): any {
        //Making a new clustergroup and adding the newLayer containing all the markers inside.
        let clusterGroup = L.markerClusterGroup({
            chunkedLoading: true,
            showCoverageOnHover: true,
            iconCreateFunction: function (cluster: any) {
                var clusterSize = "small";
                if (cluster.getChildCount() >= 5000) {
                    clusterSize = "medium";
                } else if (cluster.getChildCount() >= 10000) {
                    clusterSize = "large";
                }
                var childMarkers = cluster.getAllChildMarkers();
                childMarkers.forEach((marker: any) => {
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
    }

    private getOrgUnitLayer(orgUnit: OrganizationUnit, L: any) {
        var facilityIcon = MapObjectFactory.getMapObject(MapObjectType.FACILITY, null, L).getIcon();
        let orgUnitLayer = L.geoJSON(null, {
            pointToLayer: function (feature: any, latlng: any) {
                return L.marker(latlng, {icon: facilityIcon});
            }
        }).bindPopup(function (layer: any) {
            return layer.feature.properties.popupContent;
        });

        let geoJSON = GeoJSONUtil.exportPointToGeo(orgUnit.convertedCoord, orgUnit.displayName);
        if (geoJSON != null)
            orgUnitLayer.addData(geoJSON);
        else
            this._logger.log('Not a valid org unit', orgUnit);
        return orgUnitLayer;
    }

    private getPolylines(entityLayer: any, clusterGroup: any, L: any, color: string, selectedOrgUnit: OrganizationUnit): any {
        let uniqueEndPoints = new Set<any>();
        for (var key in entityLayer._layers) {
            if (clusterGroup.getVisibleParent(entityLayer._layers[key]) == null)
                continue;
            let lat: string = clusterGroup.getVisibleParent(entityLayer._layers[key]).getLatLng().lat;
            let lng: string = clusterGroup.getVisibleParent(entityLayer._layers[key]).getLatLng().lng;
            uniqueEndPoints.add(GeoJSONUtil.convertCoordinates(lng + "," + lat, L));
        }
        let polyLineLayer = L.geoJSON(null, {
            style: {
                "color": color,
            }
        });
        uniqueEndPoints.forEach(endPoint => {
            let geoJSON = GeoJSONUtil.exportPolyLineToGeo([endPoint, selectedOrgUnit.convertedCoord]);
            if (geoJSON != null)
                polyLineLayer.addData(geoJSON);
            else
                this._logger.log('Not a valid polyline element', endPoint);
        });
        this._logger.log('Returning:', polyLineLayer);
        return polyLineLayer;
    }

    private addControlMapOverlay(layerGroup: any, dataset: Dataset, controls: any, color: string) {
        let title = "Dataset: " + dataset.getDatasetId() + "<div style=\'border: 1px solid black; background-color:" + color + ";width:10px;height:10px\'></div>";
        controls.addOverlay(layerGroup, title);
    }


}
