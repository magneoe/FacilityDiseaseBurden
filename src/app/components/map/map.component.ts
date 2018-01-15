import {Component} from '@angular/core';
import {Dataset} from '../../models/Dataset.model';
import {MapService} from '../../services/map/map.service';
import {Logger} from "angular2-logger/core";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import {TrackedEntity} from "../../models/TrackedEntity.model";
import {IUpdateableComponent} from "../../services/IUpdateable.component";
import {OrganizationUnit} from "../../models/OrganizationUnit.model";


declare var L: any;

@Component({
    selector: 'mapComponent',
    templateUrl: '../../views/map.component.html',
    providers: [MapService]
})

/*
 * This component manages the Leaflet map
 */
export class MapComponent implements IUpdateableComponent {


    private map: any;
    private mapControl: any;
    private activeDatasets: Map<Dataset, any>;

    //private activeDatasets: Dataset[] = [];

    constructor(private _mapService: MapService, private _logger: Logger) {
        this.activeDatasets = new Map<Dataset, any>();
    }

    ngOnInit() {
        let newMapContainerId: string = 'leafletMapId';
        // Initiates the map with a given id and the controls
        this.map = this._mapService.initMap(L, newMapContainerId);
        this.mapControl = L.control.layers().addTo(this.map);
    }

    /*
     * This runs when the input data has been changed and must be rendered.
     */
    public update(dataset: Dataset, stackData: boolean, callOnFinish: any): void {
        //Clears data on the map
        if (!stackData) {
            this.removeAll();
        }
        let newLayerGroup = this._mapService.loadLayerGroup(dataset,
            this.mapControl, L, this.map);
        this.setView(dataset);
        this.activeDatasets.set(dataset, newLayerGroup);
        callOnFinish(this);
    }

    public delete(dataset:Dataset, callOnFinish:any):void {
        this._mapService.removeDataset(this.mapControl, this.map, dataset, this.activeDatasets);
        this.activeDatasets.delete(dataset);
        callOnFinish(this);
    }

    private removeAll(): void {
        this._mapService.removeAll(this.mapControl, this.map, this.activeDatasets);
        this.activeDatasets.clear();
    }

    private setView(dataset:Dataset): void {
        this._mapService.setView(this.map, dataset.getSelectedOrgUnit());
    }
}
