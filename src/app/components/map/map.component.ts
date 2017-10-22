import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MapInputDataService } from '../../services/mapInputData.service';
import { MapInputData } from '../../models/MapInputData';
import { MapService } from '../../services/map.service';


declare var L: any;

@Component({
  selector: 'mapComponent',
  templateUrl: '../../views/map.component.html',
  providers: [MapService]
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


  constructor(private _mapInputDataService: MapInputDataService, private _mapService: MapService) {
    this.mapData = new Map<string, any[]>();
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

    /*
     * For each selected programs one single layer group is being loaded,
     * containing all the markers and polyfigures connected to the program.
     */
    for (let i = 0; i < this.mapInputData.getSelectedPrograms().length; i++)
      this._mapService.loadLayerGroup(this.mapInputData, L, this.map, i, this.mapControl, this.mapData);
  }
  /*
   * Receives all map input data and store them in mapInputData variable
   */
  protected handleMapInputDataEvent(mapInputData: MapInputData){
    if(this.mapInputData == null){
      this.mapInputData = mapInputData;
      return;
    }
    if(mapInputData.getSelectedPrograms() != null)
      this.mapInputData.setSelectedPrograms(mapInputData.getSelectedPrograms());
    if(mapInputData.getSelectedOrgUnit() != null)
      this.mapInputData.setSelectedOrgUnit(mapInputData.getSelectedOrgUnit());
    if(mapInputData.getStartDate() != null && mapInputData.getEndDate() != null){
      this.mapInputData.setStartDate(mapInputData.getStartDate());
      this.mapInputData.setEndDate(mapInputData.getEndDate());
    }
  }
}
