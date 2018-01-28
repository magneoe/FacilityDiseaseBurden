"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var core_2 = require("angular2-logger/core");
var linechart_component_1 = require("./linechart.component");
var piechart_component_1 = require("./piechart.component");
var prevalenceTable_component_1 = require("./prevalenceTable.component");
var TemporalDimensionComponent = (function () {
    function TemporalDimensionComponent(_logger) {
        this._logger = _logger;
        this.activeDatasets = [];
    }
    TemporalDimensionComponent.prototype.ngOnInit = function () {
    };
    TemporalDimensionComponent.prototype.update = function (dataset, stackData, callOnFinish) {
        if (!stackData) {
            this.activeDatasets = [];
            this.lineChartComp.clearAll();
            this.pieChartComp.clearAll();
            this.prevTableComp.clearAll();
        }
        this.activeDatasets.push(dataset);
        this.lineChartComp.updateLineChart(dataset, this.activeDatasets);
        this.pieChartComp.updatePieChart(dataset);
        this.prevTableComp.updatePrevTable(dataset);
        callOnFinish(this);
    };
    TemporalDimensionComponent.prototype.delete = function (dataset, callOnFinish) {
        this.activeDatasets = this.activeDatasets.filter(function (ds) {
            return ds.getDatasetId() !== dataset.getDatasetId();
        });
        this.lineChartComp.deleteDataset(dataset, this.activeDatasets);
        this.pieChartComp.deleteDataset(dataset);
        this.prevTableComp.deleteDataset(dataset);
        callOnFinish(this);
    };
    return TemporalDimensionComponent;
}());
__decorate([
    core_1.ViewChild(linechart_component_1.LinechartComponent),
    __metadata("design:type", linechart_component_1.LinechartComponent)
], TemporalDimensionComponent.prototype, "lineChartComp", void 0);
__decorate([
    core_1.ViewChild(piechart_component_1.PiechartComponent),
    __metadata("design:type", piechart_component_1.PiechartComponent)
], TemporalDimensionComponent.prototype, "pieChartComp", void 0);
__decorate([
    core_1.ViewChild(prevalenceTable_component_1.PrevalenceTableComponent),
    __metadata("design:type", prevalenceTable_component_1.PrevalenceTableComponent)
], TemporalDimensionComponent.prototype, "prevTableComp", void 0);
TemporalDimensionComponent = __decorate([
    core_1.Component({
        selector: 'temporalComponent',
        templateUrl: '../../views/temporal/temporal.component.html',
    }),
    __metadata("design:paramtypes", [core_2.Logger])
], TemporalDimensionComponent);
exports.TemporalDimensionComponent = TemporalDimensionComponent;
//# sourceMappingURL=temporalDimension.component.js.map