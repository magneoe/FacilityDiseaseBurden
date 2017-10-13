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

export class MapComponent {

  protected mapInputData: MapInputData;
  private subscription: Subscription;
  private map: any;

  constructor(private _mapInputDataService: MapInputDataService, private _mapService: MapService) {
    // Subscribes to the Validation message service used by the child components for sending validation messages.
    this.subscription = this._mapInputDataService.getMapInputData().subscribe(mapInputData => {
      this.handleMapInputDataEvent(mapInputData);
    });

  }
  ngOnInit(){
    this.map = this._mapService.initMap(L, 'leafletMapId');
  }
  updateMap(){
    this._mapService.clearMap(L, this.map);
    for(let i = 0; i < this.mapInputData.getSelectedPrograms().length; i++)
      this._mapService.loadEntities(this.mapInputData, L, this.map, i);
  }

  /*
   * Receives all map input data and store them in mapInputData variable
   */
  handleMapInputDataEvent(mapInputData: MapInputData){
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
