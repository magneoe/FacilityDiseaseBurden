import {Component, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {MapComponent} from "../map/map.component";
import {TemporalDimensionComponent} from "../temporal/temporalDimension.component";
import {CommonResourceDispatcherService} from "../../services/dataInput/CommonResourceDispatcher.service";
import {IUpdateableComponent} from "../../services/IUpdateable.component";
import {SelectedDatasetManager} from "./selectedDatasetManager.component";
import {DataInputBuilderUtil} from "../../utils/DataInputBuilder.util";
import {MapInputDataService} from "../../services/dataInput/mapInputData.service";
import {InputDataMessage} from "../../models/InputDataMessage.model";
import {InputDataContent} from "../../enums/InputDataContent.enum";
import {Logger} from "angular2-logger/core";
import {Dataset} from "../../models/Dataset.model";
import {MapObjectFactory} from "../../utils/MapObjectFactory.util";


@Component({
    selector: 'app',
    templateUrl: '../../views/appMainContainer.component.html',
})

/*
 * This component represents the main container for all input forms that sets up the
 * initial search for the map component.
 */
export class AppMainContainerComponent implements OnDestroy {

    protected errorMessages: string[] = [];
    private subscriptionInputData: Subscription;
    private dataInputBuilder: DataInputBuilderUtil;

    addHistoricEnrollments:boolean = false;

    @ViewChild(MapComponent) mapComponent: MapComponent;
    @ViewChild(TemporalDimensionComponent) temporalComponent: TemporalDimensionComponent;
    @ViewChild(SelectedDatasetManager) selectedDatasetManager: SelectedDatasetManager;

    constructor(private _commonResourceDispatcher: CommonResourceDispatcherService,
                private _mapInputDataService: MapInputDataService,
                private _logger:Logger) {
        this._logger.log('Running contructor of app main comp');
        this.dataInputBuilder = new DataInputBuilderUtil(_logger);
        this.subscriptionInputData = this._mapInputDataService.getInputDataMessage().subscribe((inputDataMessage: InputDataMessage) => {
            this.handleInputDataMessage(inputDataMessage);
        });
    }
    ngOnInit(){
        let updateableComponents: IUpdateableComponent[] = [];
        updateableComponents.push(this.mapComponent);
        updateableComponents.push(this.temporalComponent);
        updateableComponents.push(this.selectedDatasetManager);
        this._commonResourceDispatcher.setUpdatableComponents(updateableComponents);
    }

    /*
     * The submitting
     */
    select(stackData: boolean): void {
        //Resetting colors and dataset id if we are not to stack data
        this.cleanUp(stackData);
        //This also generates color and dataset id in the 'createDataInputObject' function
        let dataset: Dataset = this.dataInputBuilder.createDataInputObject();
        if(dataset === null) {
            alert('Unable to add another dataset');
            return;
        }
        dataset.setAddHistoricEnrollments(this.addHistoricEnrollments);
        this._commonResourceDispatcher.handleUpdate(dataset, stackData);
    }

    ngOnDestroy() {
        this.subscriptionInputData.unsubscribe();
    }

    /*
 * Receives all map input data and store them in an inputData variable
 */
    protected handleInputDataMessage(inputDataMessage: InputDataMessage) {
        let dataContent = inputDataMessage.getDataContent();
        switch (dataContent) {
            case InputDataContent.ORG_UNIT:
                this.dataInputBuilder.setSelectedOrgUnit(inputDataMessage.getPayload());
                break;
            case InputDataContent.PROGRAMS:
                this.dataInputBuilder.setSelectedPrograms(inputDataMessage.getPayload());
                break;
            case InputDataContent.END_DATE:
                this.dataInputBuilder.setSelectedEndDate(inputDataMessage.getPayload());
                break;
            case InputDataContent.START_DATE:
                this.dataInputBuilder.setSelectedStartDate(inputDataMessage.getPayload());
                break;
            case InputDataContent.FILTER_QUERY_MAP:
                this.dataInputBuilder.mergeFilterQueries(inputDataMessage.getPayload());
                break;
            default:
                this._logger.log('Unknown data input');
        }
        this.errorMessages = this.dataInputBuilder.validateInputObject();
    }
    private cleanUp(stackData:boolean):void {
        if(!stackData){
            DataInputBuilderUtil.resetDatasetId();
            MapObjectFactory.reset();
        }
    }
}
