
import {Injectable} from '@angular/core';
import {MapInputData} from '../models/MapInputData';
import {HttpWrapperService} from './HttpWrapper.service';
import {TrackedEntityInstanceModel} from '../models/TrackedEntityInstance.model';
import {Observable} from 'rxjs/Observable';
import {Http} from '@angular/http';
import {OrganizationUnit} from "../models/OrganizationUnit";
import {GeoJSONUtil} from "../utils/GeoJSON.util";
import * as url from "url";

@Injectable()
export class MapService extends HttpWrapperService<TrackedEntityInstanceModel> {

  private layers:any[] = [];

  constructor(_http: Http) {
    super(_http, JSON.parse(sessionStorage.getItem("user")));
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
  public loadEntities(mapInputData: MapInputData, L: any, map: any, layerNumber:number) {
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
        this.addEntitiesToMap(trackedEntities, L, map);
        this.addOrgUnitToMap(mapInputData.getSelectedOrgUnit(), L, map);
      });
  }

  private addEntitiesToMap(trackedEntities: TrackedEntityInstanceModel[], L:any, map:any){
    let newLayer = L.geoJSON().addTo(map);
    trackedEntities.forEach(entity => {
      let geoJSON = GeoJSONUtil.exportToGeo(entity.getCoords());
      console.log('Geo JSON:', geoJSON);
      if(geoJSON != null)
        newLayer.addData(geoJSON);
    });
    this.layers.push(newLayer);
  }
  private addOrgUnitToMap(orgUnit: OrganizationUnit, L:any, map:any){


    var LeafIcon = L.Icon.extend({
      shadowUrl: '../../assets/img/leaf-shadow.png',
      iconSize:     [38, 95], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    var greenIcon = new LeafIcon({iconUrl: '../../assets/img/leaf-green.png'});
    let layer = L.geoJSON(null, {pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {icon: greenIcon});
    }}).addTo(map);

    let geoJSON = GeoJSONUtil.exportToGeo(orgUnit.coordinates);
    if(geoJSON != null) {
      console.log('Pushing layer', geoJSON);
      layer.addData(geoJSON);
      this.layers.push(layer);
    }

    //L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map).bindPopup("I am a green leaf.");
  }

  clearMap(L:any, map:any){
    this.layers.forEach(layer => {
      layer.removeFrom(map);
    });
    this.layers = [];
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
