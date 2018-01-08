import {Injectable} from '@angular/core';
import {OrganizationUnit} from "../../models/OrganizationUnit.model";
import {GeoJSONUtil} from "../../utils/GeoJSON.util";
import {Program} from "../../models/Program.model";
import {MapObjectFactory} from "../../utils/MapObjectFactory.util";
import {TrackedEntity} from "../../models/TrackedEntity.model";
import {Logger} from "angular2-logger/core";
import {MapObjectType} from "../../enums/MapObjectType.enum";


@Injectable()
export class MapService {

  constructor(private _logger:Logger) {}
  /*
   * Initates the map and returns the reference to it
   */
  public initMap(L: any, mapId: string): any {
    let map = L.map(mapId).setView([18.4272582, 79.1575702], 5);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.dark',
      accessToken: process.env.MAPBOX_ACCESS_TOKEN
    }).addTo(map);
    return map;
  }
  public setView(map:any, orgUnit:OrganizationUnit):void {
    let lat = orgUnit.coordinates.split(',')[0].slice(orgUnit.coordinates.search(/[0-9]/g), orgUnit.coordinates.length-1);
    let lng = orgUnit.coordinates.split(',')[1].slice(0, orgUnit.coordinates.search(/\\]/g));
    map.panTo([lng, lat]);
  }

  /*
   * Loads one layer group to show on map - each layergroup will contain entities, polylines and a org.Unit
   * if it does not exist.
   */
  public loadLayerGroup(selOrgUnit:OrganizationUnit, selProg:Program, trackedEntities:TrackedEntity[],
                        controls:any, mapData:Map<string, any[]>, L: any, map: any) {

      this._logger.log("Selected OrgUnit in loadLayerGroup:", selOrgUnit);
      this._logger.log("SelProg in loadLayerGroup:", selProg);
      this._logger.log("TrackedEntities in loadLayerGroup:", trackedEntities);

      let programId = selProg.id;
        //Get next available color
        let color = MapObjectFactory.getNextAvailableColor(programId);

        //Adds all the data to map and returns the overlays to pass to the map control.
        let overlayLayers = this.addDataToMap(selOrgUnit, this.getCluster(L, color), this.getEntities(trackedEntities, L, color),
           L, map, mapData, color);

        //Sets up the map overlay
        this.addControlMapOverlay(selOrgUnit, selProg, overlayLayers, controls, color);
  }

  public clearMap(controls:any, mapData:Map<string, any[]>){
    mapData.forEach(item => {
      for(let i = 0; i < item.length; i++){
        let layerGroup = item[i];
        controls.removeLayer(layerGroup);
        layerGroup.clearLayers();
      }
    });
    MapObjectFactory.reset();
    mapData.clear();
  }


  //Makes markers based on the entities with a given color and returns them as a layer reference
  private getEntities(trackedEntities: TrackedEntity[], L:any, color:string): any {
    var entityIcon = MapObjectFactory.getMapObject(MapObjectType.ENTITY, color, L).getIcon();
    let newLayer = L.geoJSON(null, {pointToLayer: function (feature:any, latlng:any) { 
      return L.marker(latlng, {icon: entityIcon});
    }}).bindPopup(function (layer:any){
      return layer.feature.properties.popupContent;
    });

    trackedEntities.forEach((entity:TrackedEntity) => {
      let geoJSON = GeoJSONUtil.exportPointToGeo(entity.getCoords(), entity.toString());
      this._logger.debug('Geo JSON:', geoJSON);
      if(geoJSON != null)
        newLayer.addData(geoJSON);
    });
    return newLayer;
  }
  private getCluster(L:any, color:string):any {
    //Making a new clustergroup and adding the newLayer containing all the markers inside.
    let clusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      showCoverageOnHover: true,
      iconCreateFunction: function(cluster:any) {
        var clusterSize = "small";
        if (cluster.getChildCount() >= 5000) {
          clusterSize = "medium";
        }else if(cluster.getChildCount() >= 10000){
          clusterSize = "large";
        }
        var childMarkers = cluster.getAllChildMarkers();
        childMarkers.forEach((marker:any) => {
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

  private getOrgUnitLayer(orgUnit: OrganizationUnit, L:any, map:any){
    var facilityIcon = MapObjectFactory.getMapObject(MapObjectType.FACILITY, null, L).getIcon();
    let layer = L.geoJSON(null, {pointToLayer: function (feature:any, latlng:any) {
      return L.marker(latlng, {icon: facilityIcon});
    }}).bindPopup(function (layer:any){
      return layer.feature.properties.popupContent;
    }).addTo(map);

    let geoJSON = GeoJSONUtil.exportPointToGeo(orgUnit.coordinates, orgUnit.displayName);
    if(geoJSON != null) {
      this._logger.log("Creating org unit geojson:", geoJSON);
      layer.addData(geoJSON);
    }
    return layer;
  }

  private addDataToMap(selectedOrgUnit:OrganizationUnit, clusterGroup:any, entityLayer:any,
                      L:any, map:any, mapData:Map<string, any[]>, color:string):Map<string, any>{
    let polyLineLayer:any = null;
    let overlayLayers = new Map<string, any>();
    clusterGroup.addLayer(entityLayer);

    let layerGroup = L.layerGroup().addTo(map);
    layerGroup.addLayer(clusterGroup);

///////////////////////Initialization of polylines////////////////////////////////////////
      let uniqueEndPoints = new Set<string>();
      for (var key in entityLayer._layers) {
          if(clusterGroup.getVisibleParent(entityLayer._layers[key]) == null)
              continue;
          let lat:string = clusterGroup.getVisibleParent(entityLayer._layers[key]).getLatLng().lat;
          let lng:string = clusterGroup.getVisibleParent(entityLayer._layers[key]).getLatLng().lng;
          uniqueEndPoints.add(lng + "," + lat);
      }
      if(polyLineLayer != null)
        layerGroup.removeLayer(polyLineLayer);
      polyLineLayer = L.geoJSON(null, {
          style: {
              "color": color,
          }
      });
      uniqueEndPoints.forEach(endPoint => {
          let geoJSON = GeoJSONUtil.exportPolyLineToGeo([endPoint, selectedOrgUnit.coordinates]);
          console.log('Geo JSON from polyLines:', geoJSON);
          if(geoJSON != null)
              polyLineLayer.addData(geoJSON);
      });

      layerGroup.addLayer(polyLineLayer); //New calculated polylines
///////////////////////END INIT POLYLINES///////////////////////////////////////

    //On zoom - remove poly lines, calculate new ones between facility and either cluster or markers.
      clusterGroup.on('animationend', function(target:any) {
          let uniqueEndPoints = new Set<string>();
          for (var key in entityLayer._layers) {
            if(clusterGroup.getVisibleParent(entityLayer._layers[key]) == null)
                continue;
              let lat:string = clusterGroup.getVisibleParent(entityLayer._layers[key]).getLatLng().lat;
              let lng:string = clusterGroup.getVisibleParent(entityLayer._layers[key]).getLatLng().lng;
              uniqueEndPoints.add(lng + "," + lat);
          }
          layerGroup.removeLayer(polyLineLayer);
          polyLineLayer = L.geoJSON(null, {
              style: {
                  "color": color,
              }
          });
          uniqueEndPoints.forEach(endPoint => {
              let geoJSON = GeoJSONUtil.exportPolyLineToGeo([endPoint, selectedOrgUnit.coordinates]);
              console.log('Geo JSON from polyLines:', geoJSON);
              if(geoJSON != null)
                  polyLineLayer.addData(geoJSON);
          });

          layerGroup.addLayer(polyLineLayer); //New calculated polylines
      });

    if(mapData.has(selectedOrgUnit.id)){
        mapData.get(selectedOrgUnit.id).push(layerGroup);
    }
    else {
      let orgUnitLayer = this.getOrgUnitLayer(selectedOrgUnit, L, map);
      overlayLayers.set(selectedOrgUnit.id, orgUnitLayer);
      mapData.set(selectedOrgUnit.id, [layerGroup, orgUnitLayer]);
    }
    overlayLayers.set("layerGroup", layerGroup);
    return overlayLayers;
  }

  private addControlMapOverlay(selectedOrgUnit:OrganizationUnit, selectedProgram:Program,
                               layerGroup:Map<string, any>, controls:any, color:string){
    let iterator = layerGroup.keys();
    layerGroup.forEach(item => {
      let title = "";
      let key = iterator.next().value;
      if(selectedOrgUnit.id == key){
        title = selectedOrgUnit.displayName;
        controls.addOverlay(layerGroup.get(key), title);
      }
      else {
        title = selectedOrgUnit.displayName + ", " + selectedProgram.displayName + "<div style='border: 1px solid black; background-color:" + color + ";width:5px;height:5px'></div>";
        controls.addOverlay(layerGroup.get(key), title);
      }
      this._logger.log("Adding controls:", layerGroup);
    });
  }
}
