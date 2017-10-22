
import {Injectable} from '@angular/core';
import {MapInputData} from '../models/MapInputData';
import {HttpWrapperService} from './HttpWrapper.service';
import {Observable} from 'rxjs/Observable';
import {Http, Response} from '@angular/http';
import {OrganizationUnit} from "../models/OrganizationUnit";
import {GeoJSONUtil} from "../utils/GeoJSON.util";
import {Programs} from "../models/Programs";
import {MapObjectFactory, MapObjectType} from "../utils/MapObjectFactory.util";
import {TrackedEntity} from "../models/TrackedEntity.model";

@Injectable()
export class MapService extends HttpWrapperService<TrackedEntity> {

  /*
   * Each entry corresponds to a orgUnit and its related layergroups,
   * one layerGroup for each program.
   */


  constructor(_http: Http) {
    super(_http, JSON.parse(sessionStorage.getItem("user")));
  }

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
  public loadLayerGroup(mapInputData: MapInputData, L: any, map: any, layerNumber:number, controls:any, mapData:Map<string, any[]>) {
      let orgUnitId = mapInputData.getSelectedOrgUnit().id;
      let programId = mapInputData.getSelectedPrograms()[layerNumber].id;
      let startDate = mapInputData.getStartDate();
      let endDate = mapInputData.getEndDate();

     this.getTrackedEntityInstances('api/trackedEntityInstances?ou=' + orgUnitId + '&' +
      'program=' + programId + '&programStartDate=' + startDate + '&programEndDate=' + endDate + '&' +
      'paging=0&fields=[attributes,lastUpdated]')
      .subscribe((units: any) => {
        console.log('TrackedEntityInstances:', units);
        let trackedEntities = [];
        units.trackedEntityInstances.forEach(unit => {
          trackedEntities.push(new TrackedEntity(unit.attributes, unit.lastUpdated));
        });
        //Get next available color
        let color = MapObjectFactory.getNextAvailableColor();

        //Adds all the data to map and returns the overlays to pass to the map control.
        let overlayLayers = this.addDataToMap(mapInputData.getSelectedOrgUnit(), this.getEntities(trackedEntities, L, color),
          this.getPolyLines(trackedEntities, L, mapInputData.getSelectedOrgUnit(), color), L, map, mapData);

        //Sets up the map overlay
        this.addControlMapOverlay(mapInputData.getSelectedOrgUnit(),
          mapInputData.getSelectedPrograms()[layerNumber], overlayLayers, controls, color);
      });
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
  // Loads the tracked entity instances from the server
  protected getTrackedEntityInstances(query: string): Observable<TrackedEntity[]> {
    return this.get(query).do((data) => console.log(JSON.stringify(data))).catch(this.handleError);
  }

  //Makes markers based on the entities with a given color and returns them as a layer reference
  private getEntities(trackedEntities: TrackedEntity[], L:any, color:string){
    var entityIcon = MapObjectFactory.getMapObject(MapObjectType.ENTITY, color, L).getIcon();
    let newLayer = L.geoJSON(null, {pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {icon: entityIcon});
    }}).bindPopup(function (layer){
      return layer.feature.properties.popupContent;
    });

    trackedEntities.forEach(entity => {
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
  private addControlMapOverlay(selectedOrgUnit:OrganizationUnit, selectedProgram:Programs,
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


  /*
   * Implements the HttpWrapper service methods
   */
  getAsArray(res: Response): TrackedEntity[] {
    return <TrackedEntity[]> res.json();
  }
  handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error());
  }
}
