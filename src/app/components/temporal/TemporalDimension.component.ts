import {Component, ViewChild} from "@angular/core";
import {Logger} from "angular2-logger/core";
import {Observable} from "rxjs/Observable";
import {TrackedEntity} from "../../models/TrackedEntity.model";
import {NgProgress} from "ngx-progressbar";
import {IUpdateableComponent} from "../../services/IUpdateable.component";
import {Dataset} from "../../models/Dataset.model";
import {OrganizationUnit} from "../../models/OrganizationUnit.model";
import {LinechartComponent} from "./linechart.component";

@Component({
  selector: 'temporalComponent',
  templateUrl: '../../views/temporal/temporal.component.html',
})

export class TemporalDimensionComponent implements IUpdateableComponent {


  private activeDatasets: Dataset[] = [];
  @ViewChild(LinechartComponent) lineChartComp:LinechartComponent;

  constructor(private _logger: Logger, private _ngProgress:NgProgress){}

  public update(dataset:Dataset, stackData:boolean, callOnFinish:any){
    if(!stackData)
        this.activeDatasets = [];
      this.activeDatasets.push(dataset);
      this.lineChartComp.updateLineChart(this.activeDatasets);
      callOnFinish(this);
  }

    public delete(dataset:Dataset, callOnFinish:any):void {
        callOnFinish(this);
    }
}
