

import {Component, ViewChild} from "@angular/core";
import {BaseChartDirective} from "ng2-charts";
import {Logger} from "angular2-logger/core";
import {Dataset} from "../../models/Dataset.model";
import {TrackedEntity} from "../../models/TrackedEntity.model";
import {OrganizationUnit} from "../../models/OrganizationUnit.model";

declare var jQuery: any;

@Component({
    selector: 'piechart',
    templateUrl: '../../views/temporal/piechart.component.html',
})


export class PiechartComponent {
    @ViewChild(BaseChartDirective) chart: BaseChartDirective;
    private readonly LABEL_PREFIX:string = "Dataset ";
    public doughnutChartLabels:string[] = [];
    public doughnutChartData:number[] = [];
    public doughnutChartType:string = 'doughnut';


    public chartColors: Array<any> = [
        { // first color
            backgroundColor:[],
        }
        ];



    constructor(private _logger: Logger) {
    }

    ngOnInit() {
        jQuery(function () {
            jQuery('#pieGraphPanelId').lobiPanel({
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

    public updatePieChart(dataset:Dataset):void {
        this._logger.log('Update', this.chart);
        try {
            if (this.chart !== undefined) {
                this.chart.ngOnDestroy();

                let data:number = this.getPieChartData(dataset.getTrackedEntityResults(), dataset.getAddHistoricEnrollments());
                this.chart.data = this.doughnutChartData.concat([data]);
                this.chartColors[0].backgroundColor.push(dataset.getColor());
                this.doughnutChartLabels.push(this.LABEL_PREFIX + dataset.getDatasetId());
                //Setting data
                this.doughnutChartData = this.chart.data;
                this.chart.labels = this.doughnutChartLabels;
                this.chart.colors = this.chartColors;

                this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
            }
            this._logger.log('Line chart data:', this.doughnutChartData);
        }
        catch (error) {
            this._logger.log('Error', error);
        }
    }
    public clearAll():void {
        this.chart.data = [];
        this.doughnutChartData = [];
        this.chartColors[0].backgroundColor = [];
        this.doughnutChartLabels = [];
    }


    public deleteDataset(dataset:Dataset):void {
        try {
            if (this.chart !== undefined) {
                this.chart.ngOnDestroy();
                let indexOfDatasetToDelete = this.doughnutChartLabels.findIndex((label: string) => {
                    return parseInt(label.split(' ')[1]) === dataset.getDatasetId()
                });
                this.chart.data.splice(indexOfDatasetToDelete, 1);
                this.doughnutChartData = this.chart.data;
                this.chartColors[0].backgroundColor.splice(indexOfDatasetToDelete, 1);
                this.doughnutChartLabels.splice(indexOfDatasetToDelete, 1);

                this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
            }
        }
        catch(error){
            this._logger.log('Could not delete dataset ' + dataset.getDatasetId(), error);
        }
    }


    // events
    public chartClicked(e:any):void {
        console.log(e);
    }

    public chartHovered(e:any):void {
        console.log(e);
    }


    private getPieChartData(trackedEntitiesResult:Map<OrganizationUnit, TrackedEntity[]>, addHistoricEnrollments:boolean):number {
        let totalNumberOfEntities = 0;
        trackedEntitiesResult.forEach((trackedEntities: TrackedEntity[], orgUnit: OrganizationUnit) => {
            trackedEntities.forEach((trackedEntity: TrackedEntity) => {
                for (let i = 0; i < trackedEntity.getEnrollments().length; i++) {
                    if (!addHistoricEnrollments && i > 0) //Assume that the first element is the most recent enrollment
                        break;
                    totalNumberOfEntities++;
                }
            });
        });
        return totalNumberOfEntities;
    }
}