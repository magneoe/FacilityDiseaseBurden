import {Component, ViewChild} from "@angular/core";
import {TrackedEntity} from "../../models/TrackedEntity.model";
import {Logger} from "angular2-logger/core";
import {Dataset} from "../../models/Dataset.model";
import {OrganizationUnit} from "../../models/OrganizationUnit.model";
import {BaseChartDirective} from "ng2-charts";
import * as moment from 'moment';
import {MapObjectFactory} from "../../utils/MapObjectFactory.util";

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

                let data: Array<any> = this.getLineChartData(startDateParsed, endDateParsed, dataset.getTrackedEntityResults(), dataset.getAddHistoricEnrollments());
                this.lineChartColors.push(this.getLineChartColor(dataset.getColor()));
                this.chart.datasets.push({
                    id: dataset.getDatasetId(),
                    data,
                    label: 'Dataset ' + dataset.getDatasetId()
                });
                this.chart.datasets.push({
                    id: dataset.getDatasetId(),
                    data: this.getTrendLineData(data),
                    label: 'Dataset ' + dataset.getDatasetId() + ' trendline',
                    hidden: true,
                });
                this.lineChartColors.push(this.getTrendlineChartColor(dataset.getColor()));

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
                if (this.chart.datasets.length === 0) {
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
        //Resettingn
        this.chart.datasets = [];
        this.lineChartColors = [];
        this.currMinDate = moment();
        this.currMaxDate = moment();
    }

    private getLineChartData(startDateParsed: any,
                             endDateParsed: any,
                             trackedEntitiesResult: Map<OrganizationUnit, TrackedEntity[]>,
                             addHistoricEnrollments: boolean): Array<any> {

        let startDateToIterate = moment(startDateParsed);
        let frequencyArray: Array<any> = new Array<any>(endDateParsed.diff(startDateParsed, 'days') + 1);

        frequencyArray[0] = {x: startDateToIterate.format(), y: 0};
        for (let i = 1; i < frequencyArray.length; i++) {
            frequencyArray[i] = {x: startDateToIterate.add(1, 'days').format(), y: 0};
        }
        trackedEntitiesResult.forEach((trackedEntities: TrackedEntity[], orgUnit: OrganizationUnit) => {
            trackedEntities.forEach((trackedEntity: TrackedEntity) => {
                for (let i = 0; i < trackedEntity.getEnrollments().length; i++) {
                    if (!addHistoricEnrollments && i > 0) //Assume that the first element is the most recent enrollment
                        continue;
                    let enrollmentDateParsed = moment(trackedEntity.getEnrollments()[i].enrollmentDate);
                    if (enrollmentDateParsed.diff(startDateParsed, 'days') > 0 && enrollmentDateParsed.diff(endDateParsed, 'days') <= 0) {
                        let frequencyArrayIndex = enrollmentDateParsed.diff(startDateParsed, 'days');
                        frequencyArray[frequencyArrayIndex].y = frequencyArray[frequencyArrayIndex].y + 1;
                    }
                }
            });
        });
        this._logger.log('Frequency array:', frequencyArray);
        return frequencyArray;
    }

    private getTrendLineData(data: any[]): any[] {
        let xyCoords: any[] = new Array<any>(data.length);

        //Calculate the xyCoord list - converting dates into numbers on x axis
        let firstDateInDataset = moment(data[0].x);
        for (let i = 0; i < data.length; i++) {
            let relativeXValue = moment(data[i].x).diff(firstDateInDataset, 'days');
            xyCoords[i] = {x: relativeXValue, y: data[i].y};
        }

        //Calculation the slope of the trendline
        let a = 0, b = 0, c = 0, d = 0, slope = 0;

        //Calculation of A value
        for (let i = 0; i < xyCoords.length; i++)
            a += xyCoords[i].x * xyCoords[i].y;
        a = a * xyCoords.length;

        //Calculation B value
        let sumXValues = 0, sumYValues = 0;
        for (let i = 0; i < xyCoords.length; i++) {
            sumXValues += xyCoords[i].x;
            sumYValues += xyCoords[i].y;
        }
        b = sumXValues * sumYValues;

        //Calculation of C
        let sumSuareRoot = 0;
        for (let i = 0; i < xyCoords.length; i++) {
            sumSuareRoot += Math.sqrt(xyCoords[i].x);
        }
        c = sumSuareRoot * xyCoords.length;

        //Calculation of D
        d = Math.sqrt(sumXValues);

        //Calculation of slope
        slope = (a - b) / (c - d);

        //Calculation of y interception on trendline
        let f = 0, intercept = 0;

        //Calculation of F
        f = slope * sumXValues;

        //Calculation of y intercept
        intercept = (sumYValues - f) / xyCoords.length;

        //Trendline equation is y = slope*X + intercept;
        let trendlineData: any[] = Array<any>(data.length);
        for (let i = 0; i < trendlineData.length; i++) {
            trendlineData[i] = {x: data[i].x, y: slope * xyCoords[i].x + intercept};
        }
        this._logger.log('Returning dataset trendline', trendlineData);
        return trendlineData;
    }

    private getTrendlineChartColor(color: string): any {
        let index = MapObjectFactory.colors.indexOf(color);

        if (index === -1) {
            return {
                backgroundColor: 'rgba(255,255,255, 0.0)',
                borderColor: 'gray',
                pointBackgroundColor: 'gray',
            }
        }
        else {
            let trendLineColor = MapObjectFactory.trendLineColors[index];
            this._logger.log('Trendline color', trendLineColor);
            return {
                backgroundColor: 'rgba(255,255,255, 0.0)',
                borderColor: trendLineColor,
                pointBackgroundColor: trendLineColor,
            };
        }
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