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

  /*
   * Loads one layer group to show on map - each layergroup will contain entities, polylines and a org.Unit
   * if it does not exist.
   */
  public loadLayerGroup(selOrgUnit:OrganizationUnit, selProg:Program, trackedEntities:TrackedEntity[],
                        controls:any, mapData:Map<string, any[]>, L: any, map: any) {
      let programId = selProg.id;
      this._logger.log("Selected OrgUnit in loadLayerGroup:", selOrgUnit);
      this._logger.log("SelProg in loadLayerGroup:", selProg);
      this._logger.log("TrackedEntities in loadLayerGroup:", trackedEntities);

        //Get next available color
        let color = MapObjectFactory.getNextAvailableColor(programId);

        //Adds all the data to map and returns the overlays to pass to the map control.
        let overlayLayers = this.addDataToMap(selOrgUnit, this.getEntities(trackedEntities, L, color),
          this.getPolyLines(trackedEntities, L, selOrgUnit, color), L, map, mapData);

        //Sets up the map overlay
        this.addControlMapOverlay(selOrgUnit, selProg, overlayLayers, controls, color);
      //});
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
  private getEntities(trackedEntities: TrackedEntity[], L:any, color:string){
    var entityIcon = MapObjectFactory.getMapObject(MapObjectType.ENTITY, color, L).getIcon();
    let newLayer = L.geoJSON(null, {pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {icon: entityIcon});
    }}).bindPopup(function (layer){
      return layer.feature.properties.popupContent;
    });

    trackedEntities.forEach((entity:TrackedEntity) => {
      let geoJSON = GeoJSONUtil.exportPointToGeo(entity.getCoords(), entity.toString());
      console.log('Geo JSON:', geoJSON);
      if(geoJSON != null)
        newLayer.addData(geoJSON);
    });
    return newLayer;
  }

  private getPolyLines(trackedEntities: TrackedEntity[], L:any, orgUnit:OrganizationUnit, color:string){
    let newLayer = L.geoJSON(null, {
      style: {
        "color": color,
      }
    });
    trackedEntities.forEach(entity => {
      let geoJSON = GeoJSONUtil.exportPolyLineToGeo([entity.getCoords(), orgUnit.coordinates]);
      console.log('Geo JSON from polyLines:', geoJSON);
      if(geoJSON != null)
        newLayer.addData(geoJSON);
    });
    return newLayer;
  }
  private getOrgUnitLayer(orgUnit: OrganizationUnit, L:any, map:any){
    var facilityIcon = MapObjectFactory.getMapObject(MapObjectType.FACILITY, null, L).getIcon();
    let layer = L.geoJSON(null, {pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {icon: facilityIcon});
    }}).bindPopup(function (layer){
      return layer.feature.properties.popupContent;
    }).addTo(map);

    let geoJSON = GeoJSONUtil.exportPointToGeo(orgUnit.coordinates, orgUnit.displayName);
    if(geoJSON != null) {
      console.log('Pushing layer', geoJSON);
      layer.addData(geoJSON);
    }
    return layer;
  }

  private addDataToMap(selectedOrgUnit:OrganizationUnit, entityLayer:any, polyLineLayer:any, L:any, map:any, mapData:Map<string, any[]>):Map<string, any>{
    let overlayLayers = new Map<string, any>();

    let layerGroup = L.layerGroup().addTo(map);
    layerGroup.addLayer(entityLayer);
    layerGroup.addLayer(polyLineLayer);

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
        /*
        layerGroup.get(key).eachLayer(layer => {
          controls.addOverlay(layer, title);
        });
        */
        controls.addOverlay(layerGroup.get(key), title);
      }
      console.log("Adding controls:", layerGroup);
    });
  }
}
