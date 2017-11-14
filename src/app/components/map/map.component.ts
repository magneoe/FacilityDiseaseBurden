import {Component} from '@angular/core';
import {InputDataObject} from '../../models/InputDataObject.model';
import {MapService} from '../../services/map/map.service';
import {FilterQuery} from "../../models/FilterQuery.model";
import {Logger} from "angular2-logger/core";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import {TrackedEntity} from "../../models/TrackedEntity.model";


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

  private activeMapInputData: InputDataObject;
  private map: any;
  private mapControl: any;
  private mapData:Map<string, any[]>;
  private trackedEntityQueue:Observable<TrackedEntity[]>[] = [];
  private trackedEntityAttributes:InputDataObject[] = [];


  constructor(private _mapService: MapService, private _logger:Logger) {
    this.mapData = new Map<string, any[]>();
    this.activeMapInputData = new InputDataObject(null, null, null, null, new Map<string, FilterQuery[]>());

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
  public updateMap(inputDataObject: InputDataObject): void {
    this._mapService.clearMap(this.mapControl, this.mapData);
    this.activeMapInputData = inputDataObject;

    Observable.forkJoin(this.trackedEntityQueue).subscribe((entityArray:any[]) => {
      this._logger.log("Update map trackedEntitiy observables:", entityArray);
      for(let i = 0; i < entityArray.length; i++){
        this._logger.log("Entities on program:", entityArray[i]);

        let trackedEntitiesArray: TrackedEntity[] = [];
        entityArray[i].trackedEntityInstances.forEach((unit: TrackedEntity) => {
          trackedEntitiesArray.push(new TrackedEntity(unit.attributes, unit.lastUpdated));
        });

        this._mapService.loadLayerGroup(this.trackedEntityAttributes[i].getSelectedOrgUnit(),
          this.trackedEntityAttributes[i].getSelectedPrograms()[0],
          trackedEntitiesArray, this.mapControl, this.mapData, L, this.map);

      };
      this.trackedEntityAttributes = [];
      this.trackedEntityQueue = [];
    });
  }

  public addData(inputDataObject:InputDataObject, trackedEntities:Observable<TrackedEntity[]>) {
    this.trackedEntityQueue.push(trackedEntities);
    this.trackedEntityAttributes.push(inputDataObject);

/*
    trackedEntities.subscribe((units: any) => {
      let trackedEntities: TrackedEntity[] = [];
      units.trackedEntityInstances.forEach((unit: TrackedEntity) => {
        trackedEntities.push(new TrackedEntity(unit.attributes, unit.lastUpdated));
      });
    });*/
  }
}
