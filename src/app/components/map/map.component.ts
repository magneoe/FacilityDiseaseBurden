import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MapInputDataService } from '../../services/mapInputData.service';
import { MapInputData } from '../../models/MapInputData.model';
import { MapService } from '../../services/map.service';
import {OrganizationUnitLoaderService} from "../../services/organizationUnitLoader.service";
import {OrganizationUnit} from "../../models/OrganizationUnit.model";
import {FilterQuery} from "../../models/FilterQuery.model";


declare var L: any;

@Component({
  selector: 'mapComponent',
  templateUrl: '../../views/map.component.html',
  providers: [MapService, OrganizationUnitLoaderService]
})

/*
 * This component manages the Leaflet map
 */
export class MapComponent {

  private mapInputData: MapInputData;
  private subscription: Subscription;
  private map: any;
  private mapControl: any;
  private mapData:Map<string, any[]>;


  constructor(private _mapInputDataService: MapInputDataService, private _mapService: MapService,
              private _organisationLoaderService:OrganizationUnitLoaderService) {
    this.mapData = new Map<string, any[]>();
    this.mapInputData = new MapInputData(null, null, null, null, new Map<string, FilterQuery[]>());
    // Subscribes to the Validation message service used by the child components for sending validation messages.
    this.subscription = this._mapInputDataService.getMapInputData().subscribe(mapInputData => {
      this.handleMapInputDataEvent(mapInputData);
    });

  }
  ngOnInit(){
    let  newMapContainerId:string = 'leafletMapId';
    // Initiates the map with a given id and the controls
    this.map = this._mapService.initMap(L, newMapContainerId);
    this.mapControl = L.control.layers().addTo(this.map);
  }
  /*
   * This runs when the input data has been changed and must be rendered.
   */
  public updateMap() {
    this._mapService.clearMap(this.mapControl, this.mapData);
    this.addDataToMap();
  }
  /*
   * Receives all map input data and store them in mapInputData variable
   */
  protected handleMapInputDataEvent(mapInputData: MapInputData){

    if(mapInputData.getSelectedPrograms() != null && mapInputData.getSelectedPrograms().length > 0) {
      this.mapInputData.setSelectedPrograms(mapInputData.getSelectedPrograms());
    }
    if(mapInputData.getSelectedOrgUnit() != null)
      this.mapInputData.setSelectedOrgUnit(mapInputData.getSelectedOrgUnit());
    if(mapInputData.getStartDate() != null && mapInputData.getEndDate() != null){
      this.mapInputData.setStartDate(mapInputData.getStartDate());
      this.mapInputData.setEndDate(mapInputData.getEndDate());
    }
    if(mapInputData.getFilterQueryMap() != null){
      this.mapInputData.mergeFilterQueries(mapInputData.getFilterQueryMap());
    }
  }

  private addDataToMap(){
    if(this.mapInputData === null || this.mapInputData.getSelectedOrgUnit() === null ||
      this.mapInputData.getSelectedPrograms() === null){
      //Do some errorHandling
      return;
    }

    this._organisationLoaderService.getOrgUnits('api/organisationUnits?fields=[id,displayName,level,coordinates,' +
      'children::size~rename(ChildCount)]&paging=0&filter=ancestors.id:eq:' + this.mapInputData.getSelectedOrgUnit().id).subscribe((units:any) => {
      //Need to resolve all subunits connected to the program (if any) - saves resources by performing the task after the form is submitted
      console.log('AddDataToMap query:', units);
      let orgUnitsToMap:OrganizationUnit[] = units.organisationUnits.filter(orgUnit => {
        if(orgUnit.ChildCount === 0 && orgUnit.coordinates !== undefined)
          return true;
        return false;
      });
      if(orgUnitsToMap === null || orgUnitsToMap.length === 0)
        orgUnitsToMap = [this.mapInputData.getSelectedOrgUnit()];
      console.log('OrgUnit array to send for mapping:', orgUnitsToMap);
      /*
       * For each selected programs one single layer group is being loaded,
       * containing all the markers and polyfigures connected to the program.
       */
      for(let selOrgIndex = 0; selOrgIndex < orgUnitsToMap.length; selOrgIndex++) {
        for (let selProgIndex = 0; selProgIndex < this.mapInputData.getSelectedPrograms().length; selProgIndex++)
          this._mapService.loadLayerGroup(orgUnitsToMap[selOrgIndex], this.mapInputData.getSelectedPrograms()[selProgIndex],
            this.mapInputData.getStartDate(), this.mapInputData.getEndDate(), this.mapInputData.getFilterQueryMap(), this.mapControl, this.mapData, L, this.map);
      }
    });
  }
}
