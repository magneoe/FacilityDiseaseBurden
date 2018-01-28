
import {Component, ComponentFactoryResolver, ComponentRef, ViewChild, ViewContainerRef} from "@angular/core";
import {Logger} from "angular2-logger/core";
import {Dataset} from "../../models/Dataset.model";
import {MapInputDataService} from "../../services/dataInput/mapInputData.service";
import {Subscription} from "rxjs/Subscription";
import {InputDataMessage} from "../../models/InputDataMessage.model";
import {InputDataContent} from "../../enums/InputDataContent.enum";
import {ProgramFilterComponent} from "../forms/program/programFilter.component";
import {OrganizationUnit} from "../../models/OrganizationUnit.model";
import {TrackedEntity} from "../../models/TrackedEntity.model";
import {FilterQuery} from "../../models/FilterQuery.model";
import {OperatorType} from "../../enums/OperatorType.enum";

declare var jQuery: any;

@Component({
    selector: 'prevalenceTable',
    templateUrl: '../../views/temporal/prevalenceTable.component.html',
})



export class PrevalenceTableComponent {
    protected activeDatasets:Dataset[] = [];
    protected prevalence:string = '-';
    protected RECIEVER_ADDRESS:number = MapInputDataService.REVIEVER_ADDRESS_PREV_TABLE;

    private selectedDataset:Dataset = null;
    private subscriptionInputData: Subscription;
    private filterComp:ComponentRef<ProgramFilterComponent>;

    @ViewChild('prevalenceFilterContainer', {read: ViewContainerRef}) container: ViewContainerRef;

    constructor(private _logger:Logger, private _mapInputDataService: MapInputDataService, private _cfr: ComponentFactoryResolver){
        this.subscriptionInputData = this._mapInputDataService.getInputDataMessage().subscribe((inputDataMessage: InputDataMessage) => {
            if(inputDataMessage.getReciever() === this.RECIEVER_ADDRESS)
                this.handleInputDataMessage(inputDataMessage);
        });
    }

    ngOnInit() {
        jQuery(function () {
            jQuery('#prevTableId').lobiPanel({
                reload: false,
                close: false,
                unpin: {
                    icon : 'glyphicon glyphicon-move',
                    tooltip : 'Unpin'
                },
                draggable: true,
                resize: 'both',
                maxWidth: jQuery(window).width()-100,
                maxHeight: jQuery(window).height()-100,
                minWidth: 100,
                minHeight: 100,
                expandAnimation: 700,
                collapseAnimation: 700,
            });
        });
    }
    public loadFilter(datasetId:any):void {
        this.container.clear();
        if(datasetId == -1 && this.filterComp !== undefined) {
            this.filterComp.destroy();
        }
        else {
            this.selectedDataset = this.activeDatasets.find(curr => {return curr.getDatasetId() == datasetId});
            let comp = this._cfr.resolveComponentFactory(ProgramFilterComponent);
            this.filterComp = this.container.createComponent(comp);
            this.filterComp.instance._ref = this.filterComp;
            this.filterComp.instance.setSelectedOrgUnit(this.selectedDataset.getSelectedOrgUnit());
            this.filterComp.instance.setProgram(this.selectedDataset.getSelectedPrograms()[0]);
            this.filterComp.instance.setRecieverAddress(this.RECIEVER_ADDRESS);
            this.filterComp.instance.setMaxFilters(1);

        }
    }

    public clearAll():void {
        this.activeDatasets = [];
        this.destroyComponent(this.filterComp);
    }
    public updatePrevTable(dataset:Dataset):void {
        this.activeDatasets.push(dataset);
    }
    public deleteDataset(dataset:Dataset):void {
        this.activeDatasets = this.activeDatasets.filter(curr =>
        {return curr.getDatasetId() !== dataset.getDatasetId()});
        this.destroyComponent(this.filterComp);
    }
    public handleInputDataMessage(inputDataMessage:InputDataMessage):void {
        if(inputDataMessage.getDataContent() === InputDataContent.FILTER_QUERY_MAP){
            this.prevalence = this.getPrevalence(inputDataMessage.getPayload(), this.selectedDataset.getTrackedEntityResults());
        }
    }
    private getPrevalence(payLoad:any, trackedEntityResults:Map<OrganizationUnit, TrackedEntity[]>):string {
        let prevalence:string, totalEntitiesInDataset:number = 0, totalEntitiesInFilter:number = 0;
        trackedEntityResults.forEach((trackedEntities:TrackedEntity[], orgUnit:OrganizationUnit) => {
            trackedEntities.forEach((trackedEntity:TrackedEntity) => {

                totalEntitiesInDataset++;
                if(this.matchFilter(payLoad, trackedEntity))
                    totalEntitiesInFilter++;
            });
        });

        prevalence = ((totalEntitiesInFilter/totalEntitiesInDataset)*100) + '%';
        return prevalence;
    }
    private matchFilter(payLoad:any, trackedEntity:TrackedEntity):boolean {
        let filterQuery = payLoad.get(this.selectedDataset.getSelectedPrograms()[0].id)[0];
        if(filterQuery !== undefined)
        {
            switch (filterQuery.getOperator()) {

                case OperatorType.GREATER_THAN:
                    return this.matchRange(payLoad.get(this.selectedDataset.getSelectedPrograms()[0].id), trackedEntity);
                case OperatorType.LESS_THAN:
                    return this.matchRange(payLoad.get(this.selectedDataset.getSelectedPrograms()[0].id), trackedEntity);
                case OperatorType.EQUALS:
                    return this.matchEquals(payLoad.get(this.selectedDataset.getSelectedPrograms()[0].id)[0], trackedEntity);
                case OperatorType.LIKE:
                    return this.matchLike(payLoad.get(this.selectedDataset.getSelectedPrograms()[0].id)[0], trackedEntity);
            }
        }
        return false;
    }
    private matchEquals(filterQuery:FilterQuery, trackedEntity:TrackedEntity):boolean {
        let selectedAttribute = trackedEntity.attributes.find(attribute =>
            {return attribute.code == filterQuery.getTrackedEntityAttributes().code});

        if(selectedAttribute.value == filterQuery.getValue()){
            return true;
        }
        return false;
    }
    private matchLike(filterQuery:FilterQuery, trackedEntity:TrackedEntity):boolean {
        let selectedAttribute = trackedEntity.attributes.find(attribute =>
        {return attribute.code == filterQuery.getTrackedEntityAttributes().code});

        if(selectedAttribute.value.includes(filterQuery.getValue())){
            return true;
        }
        return false;
    }
    private matchRange(filterQueries:FilterQuery[], trackedEntity:TrackedEntity):boolean {
        let lowerCap = filterQueries.find(curr => {return curr.getOperator() === OperatorType.GREATER_THAN});
        let upperCap = filterQueries.find(curr => {return curr.getOperator() === OperatorType.LESS_THAN});

        let selectedAttributeLower = trackedEntity.attributes.find(attribute =>
            {return attribute.code == lowerCap.getTrackedEntityAttributes().code});
        let selectedAttributeUpper = trackedEntity.attributes.find(attribute =>
            {return attribute.code == upperCap.getTrackedEntityAttributes().code});

        if(parseInt(selectedAttributeLower.value) >= parseInt(lowerCap.getValue()) &&
            parseInt(selectedAttributeUpper.value) <= parseInt(upperCap.getValue())){
            return true;
        }
        return false;
    }
    private destroyComponent(comp:any):void {
        this.container.clear();
        if(comp !== undefined) {
            comp.destroy();
        }
    }
}