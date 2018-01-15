

import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {TrackedEntity} from "../../models/TrackedEntity.model";
import {Logger} from "angular2-logger/core";
import {Dataset} from "../../models/Dataset.model";
import {OrganizationUnit} from "../../models/OrganizationUnit.model";
import {BaseChartDirective} from "ng2-charts";

@Component({
    selector: 'linechart',
    templateUrl: '../../views/temporal/linechart.component.html',
})
/*

 */

export class LinechartComponent {
    @ViewChild(BaseChartDirective) chart: BaseChartDirective;
    // lineChart
    public lineChartData:Array<any> = [
        {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
        {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
        {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
    ];
    public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChartOptions:any = {
        responsive: true
    };
    public lineChartColors:Array<any> = [
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        { // dark grey
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];
    public lineChartLegend:boolean = true;
    public lineChartType:string = 'line';


    // events
    public chartClicked(e:any):void {
        console.log(e);
    }
    public chartHovered(e:any):void {
        console.log(e);
    }

    constructor(private _logger:Logger){}

    updateLineChart(activeDatasets:Dataset[]):void {
        if (this.chart !== undefined) {
            this.chart.ngOnDestroy();
            this.chart.datasets = [];
            activeDatasets.forEach((dataset:Dataset) => {
                let data:Array<number> = this.getLineChartDate(dataset.getStartDate(),
                    dataset.getEndDate(), dataset.getTrackedEntityResults());
                this.chart.datasets.push({data, label: 'Dataset ' + dataset.getDatasetId()});
            });
            this.lineChartData = this.chart.datasets;
            this.chart.labels = this.lineChartLabels;
            this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
        }
        this._logger.log('Line chart data:', this.lineChartData);
    }
    private getLineChartDate(startDate:string, endDate:string, trackedEntitiesResult:Map<OrganizationUnit, TrackedEntity[]>):Array<number>{
        let startDateParsed = new Date(Date.parse(startDate));
        let endDateParsed = new Date(Date.parse(endDate));

        let frequencyArray:Array<number> = [];
        for (var day = startDateParsed; day <= endDateParsed; day.setDate(day.getDate() + 1)) {
            let occurencesOnGivenDay = 0;
            trackedEntitiesResult.forEach((trackedEntities:TrackedEntity[], orgUnit:OrganizationUnit)=> {
                this._logger.log('TrackedENtities:', trackedEntities);
               trackedEntities.forEach((entity:TrackedEntity)=>{
                   //let lastUpdated = entity.getLastUpdated();
                  /* if(lastUpdated !== undefined && lastUpdated !== null) {
                       this._logger.log('Last updated:', lastUpdated);
                       if (day.getFullYear() === lastUpdated.getFullYear() &&
                           day.getMonth() === lastUpdated.getMonth() &&
                           day.getDate() === lastUpdated.getDate())
                           occurencesOnGivenDay++;
                   }*/
               });
            });
            frequencyArray.push(occurencesOnGivenDay);
        }
        return frequencyArray;
    }
}