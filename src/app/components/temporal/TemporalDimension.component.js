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
var ngx_progressbar_1 = require("ngx-progressbar");
var linechart_component_1 = require("./linechart.component");
var TemporalDimensionComponent = (function () {
    function TemporalDimensionComponent(_logger, _ngProgress) {
        this._logger = _logger;
        this._ngProgress = _ngProgress;
        this.activeDatasets = [];
    }
    TemporalDimensionComponent.prototype.update = function (dataset, stackData, callOnFinish) {
        if (!stackData)
            this.activeDatasets = [];
        this.activeDatasets.push(dataset);
        this.lineChartComp.updateLineChart(this.activeDatasets);
        callOnFinish(this);
    };
    TemporalDimensionComponent.prototype.delete = function (dataset, callOnFinish) {
        callOnFinish(this);
    };
    return TemporalDimensionComponent;
}());
__decorate([
    core_1.ViewChild(linechart_component_1.LinechartComponent),
    __metadata("design:type", linechart_component_1.LinechartComponent)
], TemporalDimensionComponent.prototype, "lineChartComp", void 0);
TemporalDimensionComponent = __decorate([
    core_1.Component({
        selector: 'temporalComponent',
        templateUrl: '../../views/temporal/temporal.component.html',
    }),
    __metadata("design:paramtypes", [core_2.Logger, ngx_progressbar_1.NgProgress])
], TemporalDimensionComponent);
exports.TemporalDimensionComponent = TemporalDimensionComponent;
//# sourceMappingURL=temporalDimension.component.js.map