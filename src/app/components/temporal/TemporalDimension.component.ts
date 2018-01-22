import {Component, ViewChild} from "@angular/core";
import {Logger} from "angular2-logger/core";
import {IUpdateableComponent} from "../../services/IUpdateable.component";
import {Dataset} from "../../models/Dataset.model";
import {LinechartComponent} from "./linechart.component";
import {PiechartComponent} from "./piechart.component";

@Component({
    selector: 'temporalComponent',
    templateUrl: '../../views/temporal/temporal.component.html',
})

export class TemporalDimensionComponent implements IUpdateableComponent {


    private activeDatasets:Dataset[] = [];
    @ViewChild(LinechartComponent) lineChartComp: LinechartComponent;
    @ViewChild(PiechartComponent) pieChartComp:PiechartComponent;

    constructor(private _logger: Logger) {
    }
    ngOnInit() {
    }

    public update(dataset: Dataset, stackData: boolean, callOnFinish: any) {
        if (!stackData) {
            this.activeDatasets = [];
            this.lineChartComp.clearAll();
            this.pieChartComp.clearAll();
        }
        this.activeDatasets.push(dataset);
        this.lineChartComp.updateLineChart(dataset, this.activeDatasets);
        this.pieChartComp.updatePieChart(dataset);

        callOnFinish(this);
    }

    public delete(dataset: Dataset, callOnFinish: any): void {
        this.activeDatasets = this.activeDatasets.filter(ds => {
            return ds.getDatasetId() !== dataset.getDatasetId()
        });
        this.lineChartComp.deleteDataset(dataset, this.activeDatasets);
        this.pieChartComp.deleteDataset(dataset);
        callOnFinish(this);
    }
}
