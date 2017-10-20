
import {Injectable} from '@angular/core';
import {MapInputData} from '../models/MapInputData';
import {HttpWrapperService} from './HttpWrapper.service';
import {TrackedEntityInstanceModel} from '../models/TrackedEntityInstance.model';
import {Observable} from 'rxjs/Observable';
import {Http} from '@angular/http';
import {OrganizationUnit} from "../models/OrganizationUnit";
import {GeoJSONUtil} from "../utils/GeoJSON.util";
import {Programs} from "../models/Programs";
import {ColorHandlerUtil} from "../utils/colorHandler.util";

@Injectable()
export class MapService extends HttpWrapperService<TrackedEntityInstanceModel> {

  private mapData:Map<string, any[]>;

  constructor(_http: Http) {
    super(_http, JSON.parse(sessionStorage.getItem("user")));
    this.mapData = new Map<string, any[]>();
  }


  public initMap(L: any, mapId: string): any {
    let map = L.map(mapId).setView([18.4272582, 79.1575702], 5);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.dark',
      accessToken: 'pk.eyJ1IjoibWFnbmVvZSIsImEiOiJjajg3MmlneDYwemJuMzNsc2JhYjBzeGI4In0.fPHgyV7ew5S2HDQAeuNhIw'
    }).addTo(map);

    return map;
  }
  public loadEntities(mapInputData: MapInputData, L: any, map: any, layerNumber:number, controls:any) {
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
          trackedEntities.push(new TrackedEntityInstanceModel(unit.attributes, unit.lastUpdated));
        });
        let color = ColorHandlerUtil.getNextAvailableColor();
        let overlayLayers = this.addDataToMap(mapInputData.getSelectedOrgUnit(), this.getEntities(trackedEntities, L, color),
          this.getPolyLines(trackedEntities, L, mapInputData.getSelectedOrgUnit(), color), L, map);

        this.addControlMapOverlay(mapInputData.getSelectedOrgUnit(),
          mapInputData.getSelectedPrograms()[layerNumber], overlayLayers, controls);
      });
  }

  private getEntities(trackedEntities: TrackedEntityInstanceModel[], L:any, color:string){
    var icon = ColorHandlerUtil.getMarker(color, L);
    let newLayer = L.geoJSON(null, {pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {icon: icon});
    }});
    trackedEntities.forEach(entity => {
      let geoJSON = GeoJSONUtil.exportPointToGeo(entity.getCoords());
      console.log('Geo JSON:', geoJSON);
      if(geoJSON != null)
        newLayer.addData(geoJSON);
    });
    return newLayer;
  }
  private getPolyLines(trackedEntities: TrackedEntityInstanceModel[], L:any, orgUnit:OrganizationUnit, color:string){
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
  private getOrgUnit(orgUnit: OrganizationUnit, L:any, map:any){
    var LeafIcon = L.Icon.extend({
      shadowUrl: '../../assets/img/facility-shadow.png',
      iconSize:     [38, 95], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    var greenIcon = new LeafIcon({iconUrl: '../../assets/img/facility.png'});
    let layer = L.geoJSON(null, {pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {icon: greenIcon});
    }});

    let geoJSON = GeoJSONUtil.exportPointToGeo(orgUnit.coordinates);
    if(geoJSON != null) {
      console.log('Pushing layer', geoJSON);
      layer.addData(geoJSON);
    }
    return layer;
    //L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map).bindPopup("I am a green leaf.");
  }

  private addDataToMap(selectedOrgUnit:OrganizationUnit, entityLayer:any, polyLineLayer:any, L:any, map:any):Map<string, any>{
    let overlayLayers = new Map<string, any>();

    let layerGroup = L.layerGroup().addTo(map);
    layerGroup.addLayer(entityLayer);
    layerGroup.addLayer(polyLineLayer);

    if(this.mapData.has(selectedOrgUnit.id)){
        this.mapData.get(selectedOrgUnit.id).push(layerGroup);
    }
    else {
      let orgUnitLayer = L.geoJSON().addTo(map);
      orgUnitLayer = this.getOrgUnit(selectedOrgUnit, L, map);
      overlayLayers.set(selectedOrgUnit.id, orgUnitLayer);
      this.mapData.set(selectedOrgUnit.id, [layerGroup]);
    }
    overlayLayers.set("layerGroup", layerGroup);
    return overlayLayers;
  }
  private addControlMapOverlay(selectedOrgUnit:OrganizationUnit, selectedProgram:Programs,
                               layerGroup:Map<string, any>, controls:any){
    let iterator = layerGroup.keys();
    layerGroup.forEach(item => {
      let title = "";
      let key = iterator.next().value;
      if(selectedOrgUnit.id == key){
        title = selectedOrgUnit.displayName;
        controls.addOverlay(layerGroup.get(key), title);
      }
      else {
        title = selectedOrgUnit.displayName + ", " + selectedProgram.displayName;
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
  clearMap(L:any){
    this.mapData.forEach(item => {
      for(let i = 0; i < item.length; i++){
        let layerGroup = item[i];
        L.control.removeLayer(layerGroup);
        layerGroup.clearLayers();
      }
    });
    ColorHandlerUtil.reset();
    this.mapData = new Map<string, any>();
  }

  getTrackedEntityInstances(query: string): Observable<TrackedEntityInstanceModel[]> {
    return this.get(query).do((data) => console.log(JSON.stringify(data))).catch(this.handleError);
  }

  /*
   * Implements the HttpWrapper service methods
   */
  getAsArray(res: Response): TrackedEntityInstanceModel[] {
    return <TrackedEntityInstanceModel[]> res.json();
  }
  handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error());
  }
}
