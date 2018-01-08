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
var Observable_1 = require("rxjs/Observable");
var TrackedEntity_model_1 = require("../../models/TrackedEntity.model");
var ngx_progressbar_1 = require("ngx-progressbar");
var TemporalDimensionComponent = (function () {
    function TemporalDimensionComponent(_logger, _ngProgress) {
        this._logger = _logger;
        this._ngProgress = _ngProgress;
        this.trackedEntityQueue = [];
        this.trackedEntityAttributes = [];
    }
    TemporalDimensionComponent.prototype.update = function (inputDataObject, stackData, callOnFinish) {
        var _this = this;
        this._logger.log("UpdateTemporalDimension invoked", inputDataObject);
        this.clear();
        this.activeInputData = inputDataObject;
        Observable_1.Observable.forkJoin(this.trackedEntityQueue).subscribe(function (entityArray) {
            _this._logger.debug("Update map trackedEntitiy observables:", entityArray);
            var _loop_1 = function (i) {
                _this._logger.debug("Entities on program:", entityArray[i]);
                var trackedEntitiesArray = [];
                entityArray[i].trackedEntityInstances.forEach(function (unit) {
                    trackedEntitiesArray.push(new TrackedEntity_model_1.TrackedEntity(unit.attributes, unit.lastUpdated));
                });
                //Do something with the datas
            };
            for (var i = 0; i < entityArray.length; i++) {
                _loop_1(i);
            }
            ;
            _this.trackedEntityAttributes = [];
            _this.trackedEntityQueue = [];
            callOnFinish(_this);
        });
    };
    TemporalDimensionComponent.prototype.addData = function (inputDataObject, trackedEntities) {
        this._logger.log("Add data in temporalDimension invoked", inputDataObject);
        this._logger.log("Add data in temporalDimension invoked", trackedEntities);
        this.trackedEntityQueue.push(trackedEntities);
        this.trackedEntityAttributes.push(inputDataObject);
    };
    TemporalDimensionComponent.prototype.clear = function () {
    };
    return TemporalDimensionComponent;
}());
TemporalDimensionComponent = __decorate([
    core_1.Component({
        selector: 'temporalComponent',
        templateUrl: '../../views/temporal.component.html',
    }),
    __metadata("design:paramtypes", [core_2.Logger, ngx_progressbar_1.NgProgress])
], TemporalDimensionComponent);
exports.TemporalDimensionComponent = TemporalDimensionComponent;
//# sourceMappingURL=TemporalDimension.component.js.map