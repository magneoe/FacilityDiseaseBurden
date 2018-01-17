import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {TrackedEntity} from "../../models/TrackedEntity.model";
import {Logger} from "angular2-logger/core";
import {Dataset} from "../../models/Dataset.model";
import {OrganizationUnit} from "../../models/OrganizationUnit.model";
import {BaseChartDirective} from "ng2-charts";
import {Enrollment} from "../../models/Enrollment.model";
import * as moment from 'moment';

declare var jQuery: any;

@Component({
    selector: 'linechart',
    templateUrl: '../../views/temporal/linechart.component.html',
})
/*

 */

export class LinechartComponent {
    @ViewChild(BaseChartDirective) chart: BaseChartDirective;
    private currMinDate = moment();
    private currMaxDate = moment();
    // lineChart
    public lineChartData: Array<any> = [
        {}
    ];
    public lineChartLabels: Array<any> = [];
    public lineChartOptions: any = {
        responsive: true,
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'No. of enrollments'
                }
            }],
            xAxes: [{
                type: 'time',
                distribution: 'linear',
                bounds: 'ticks',
                ticks: {
                    source: 'data',
                    autoSkip: true,
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Date'
                },
                time: {
                    displayFormats: {
                        month: 'MMM YYYY',
                    },
                    minUnit: 'day',
                    min: this.currMinDate.format(),
                    max: this.currMaxDate.format(),
                },
            }
            ]
        },
        title: {
            display: true,
            text: 'Enrollment frequency over time'
        },
    };
    public lineChartColors: Array<any> = [
        {}
    ];
    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';


    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    constructor(private _logger: Logger) {

    }

    ngOnInit() {
        jQuery(function () {
            jQuery('#linegraph').lobiPanel({
                reload: false,
                close: false,
                unpin: false,
                maxWidth: jQuery(window).width(),
                maxHeight: jQuery(window).height(),
                expandAnimation: 700,
                collapseAnimation: 700,
            });
        });
    }

    updateLineChart(dataset: Dataset): void {
        try {
            if (this.chart !== undefined) {
                this.chart.ngOnDestroy();

                let startDateParsed = this.getStartDateParsed(dataset.getStartDate());
                let endDateParsed = this.getEndDateParsed(dataset.getEndDate());

                let data: Array<any> = this.getLineChartDate(startDateParsed, endDateParsed, dataset.getTrackedEntityResults());
                this.lineChartColors.push(this.getLineChartColor(dataset.getColor()));
                this.chart.datasets.push({
                    id: dataset.getDatasetId(),
                    data,
                    label: 'Dataset ' + dataset.getDatasetId()
                });

                this.renderMinMaxUnits(startDateParsed, endDateParsed);
                //Setting data
                this.lineChartData = this.chart.datasets;
                this.chart.colors = this.lineChartColors;
                this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
            }
            this._logger.log('Line chart data:', this.lineChartData);
        }
        catch (error) {
            this._logger.log('Error', error);
        }
    }

    public deleteDataset(dataset: Dataset): void {
        try {
            if (this.chart !== undefined) {
                this.chart.ngOnDestroy();
                let startDateParsed = this.getStartDateParsed(dataset.getStartDate());
                let endDateParsed = this.getEndDateParsed(dataset.getEndDate());

                let removeIndex = this.chart.datasets.findIndex(element => {
                    return element.id === dataset.getDatasetId()
                });
                //Remove dataset
                this.chart.datasets = this.chart.datasets.filter(element => {
                    return element.id !== dataset.getDatasetId()
                });
                //Remove color
                this.chart.colors.splice(removeIndex, 1);
                //Ensure there are some basic data if empty
                if(this.chart.datasets.length === 0){
                    this.chart.datasets = [{}];
                    this.chart.colors = [{}];
                }
                //Update x-axis max/min
                this.renderMinMaxUnits(startDateParsed, endDateParsed);
                this.lineChartData = this.chart.datasets;
                this.lineChartColors = this.chart.colors;
                this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
            }
        }
        catch (error) {
            this._logger.log('Error', error);
        }
    }

    public clearAll(): void {
        //Resetting
        this.chart.datasets = [];
        this.lineChartColors = [];
        this.currMinDate = moment();
        this.currMaxDate = moment();
    }

    private getLineChartDate(startDateParsed: any, endDateParsed: any, trackedEntitiesResult: Map<OrganizationUnit, TrackedEntity[]>): Array<any> {
        let startDateToIterate = moment(startDateParsed);
        let frequencyArray: Array<any> = new Array<any>(endDateParsed.diff(startDateParsed, 'days') + 1);

        frequencyArray[0] = {x: startDateToIterate.format(), y: 0};
        for (let i = 1; i < frequencyArray.length; i++) {
            frequencyArray[i] = {x: startDateToIterate.add(1, 'days').format(), y: 0};
        }
        trackedEntitiesResult.forEach((trackedEntities: TrackedEntity[], orgUnit: OrganizationUnit) => {
            trackedEntities.forEach((trackedEntity: TrackedEntity) => {
                trackedEntity.getEnrollments().forEach((enrollment: Enrollment) => {
                    let enrollmentDateParsed = moment(enrollment.enrollmentDate);
                    if (enrollmentDateParsed.diff(startDateParsed, 'days') > 0 && enrollmentDateParsed.diff(endDateParsed, 'days') <= 0) {
                        let frequencyArrayIndex = enrollmentDateParsed.diff(startDateParsed, 'days');
                        frequencyArray[frequencyArrayIndex].y = frequencyArray[frequencyArrayIndex].y + 1;
                    }
                });
            });
        });
        this._logger.log('Frequency array:', frequencyArray);
        return frequencyArray;
    }

    private getLineChartColor(color: string): any {
        return {
            backgroundColor: 'rgba(255,255,255, 0.0)',
            borderColor: color,
            pointBackgroundColor: color,
        };
    }

    private getStartDateParsed(startDate: string): any {
        let startDateParsed = moment(startDate);
        if (startDateParsed.diff(this.currMinDate, 'days') < 0)
            this.currMinDate = startDateParsed;
        return startDateParsed;
    }

    private getEndDateParsed(endDate: string): any {
        let endDateParsed = moment(endDate);
        if (endDateParsed.diff(this.currMaxDate, 'days') > 0)
            this.currMaxDate = endDateParsed;
        return endDateParsed;
    }

    private renderMinMaxUnits(startDateParsed: any, endDateParsed: any): void {

        //Setting min/max date
        this.lineChartOptions.scales.xAxes[0].time.min = (this.chart.datasets.length === 0 ? moment().format() : startDateParsed.format());
        this.lineChartOptions.scales.xAxes[0].time.max = (this.chart.datasets.length === 0 ? moment().format() : endDateParsed.format());
    }
}