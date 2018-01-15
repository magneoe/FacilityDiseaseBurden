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
var Rx_1 = require("rxjs/Rx");
var TrackedEntity_model_1 = require("../../models/TrackedEntity.model");
var organizationUnitLoader_service_1 = require("../dataLoading/organizationUnitLoader.service");
var core_2 = require("angular2-logger/core");
var TrackedEntityLoaderService_service_1 = require("../dataLoading/TrackedEntityLoaderService.service");
var MapObjectFactory_util_1 = require("../../utils/MapObjectFactory.util");
var ngx_progressbar_1 = require("ngx-progressbar");
var CommonResourceDispatcherService = (function () {
    function CommonResourceDispatcherService(_organisationLoaderService, _logger, _trackedEntityLoaderService, _ngProgress) {
        this._organisationLoaderService = _organisationLoaderService;
        this._logger = _logger;
        this._trackedEntityLoaderService = _trackedEntityLoaderService;
        this._ngProgress = _ngProgress;
        this.updateableComponents = [];
    }
    CommonResourceDispatcherService.prototype.setUpdatableComponents = function (updateableComponents) {
        this.updateableComponents = updateableComponents;
    };
    CommonResourceDispatcherService.prototype.handleUpdate = function (dataset, stackData) {
        var _this = this;
        if (dataset === null)
            return;
        var callOnFinish = this.startTimer(this.updateableComponents);
        try {
            this.getOrgUnitChildern(dataset).subscribe(function (units) {
                //Need to resolve all subunits connected to the program (if any) - saves resources by performing the task after the form is submitted
                var orgUnitsToLoad = _this.getOrgUnitsToLoad(dataset, units);
                /*
                 * For each selected programs one single layer group is being loaded,
                 * containing all the markers and polyfigures connected to the program.
                 */
                for (var selOrgIndex = 0; selOrgIndex < orgUnitsToLoad.length; selOrgIndex++) {
                    for (var selProgIndex = 0; selProgIndex < dataset.getSelectedPrograms().length; selProgIndex++) {
                        var trackedEntities = _this._trackedEntityLoaderService.getTrackedEntityInstancesByQuery(orgUnitsToLoad[selOrgIndex], dataset.getSelectedPrograms()[selProgIndex], dataset.getStartDate(), dataset.getEndDate(), dataset.getFilterQueryMap());
                        dataset.addTrackedEntityQuery(orgUnitsToLoad[selOrgIndex], trackedEntities);
                    }
                }
                /*this.updateableComponents.forEach(comp => {
                    if (comp !== null)
                        comp.update(dataset, stackData, callOnFinish);
                });*/
                _this.loadTracedEntitiesAsync(dataset, stackData, callOnFinish);
            });
        }
        catch (error) {
            this._logger.log(error);
        }
    };
    CommonResourceDispatcherService.prototype.loadTracedEntitiesAsync = function (dataset, stackData, callOnFinish) {
        var _this = this;
        var trackedEntityQueue = Array.from(dataset.getTrackedEntityQueryMap().values());
        var organisationUnits = Array.from(dataset.getTrackedEntityQueryMap().keys());
        Rx_1.Observable.forkJoin(trackedEntityQueue).subscribe(function (resultArray) {
            var _loop_1 = function (i) {
                var trackedEntitiesArray = [];
                resultArray[i].trackedEntityInstances.forEach(function (unit) {
                    trackedEntitiesArray.push(new TrackedEntity_model_1.TrackedEntity(unit.attributes, unit.enrollments));
                });
                dataset.addTrackedEntityResults(organisationUnits[i], trackedEntitiesArray);
            };
            for (var i = 0; i < resultArray.length; i++) {
                _loop_1(i);
            }
            _this.updateableComponents.forEach(function (comp) {
                if (comp !== null)
                    comp.update(dataset, stackData, callOnFinish);
            });
        });
    };
    CommonResourceDispatcherService.prototype.deleteDataset = function (dataset) {
        if (dataset === null)
            return;
        try {
            var callOnFinish_1 = this.startTimer(this.updateableComponents);
            this.updateableComponents.forEach(function (comp) {
                comp.delete(dataset, callOnFinish_1);
                MapObjectFactory_util_1.MapObjectFactory.releaseColor(dataset.getColor());
            });
        }
        catch (error) {
            this._logger.log(error);
        }
    };
    CommonResourceDispatcherService.prototype.getOrgUnitsToLoad = function (inputDataObject, units) {
        //Need to resolve all subunits connected to the program (if any) - saves resources by performing the task after the form is submitted
        var orgUnitsToLoad = units.organisationUnits.filter(function (orgUnit) {
            if (orgUnit.ChildCount === 0 && orgUnit.coordinates !== undefined)
                return true;
            return false;
        });
        if (orgUnitsToLoad === null || orgUnitsToLoad.length === 0)
            orgUnitsToLoad = [inputDataObject.getSelectedOrgUnit()];
        return orgUnitsToLoad;
    };
    CommonResourceDispatcherService.prototype.startTimer = function (updateableComponents) {
        var _this = this;
        //The list of components that still not have reported that their are finished
        var pendingComponentsInProgress = [];
        pendingComponentsInProgress = pendingComponentsInProgress.concat(updateableComponents);
        //Upon finshed - remove the component from the pendingComponentsList
        var callOnFinish = function (component) {
            var _loop_2 = function (i) {
                if (pendingComponentsInProgress[i] === component) {
                    pendingComponentsInProgress = pendingComponentsInProgress.filter(function (comp) {
                        if (comp !== pendingComponentsInProgress[i])
                            return true;
                    });
                }
            };
            for (var i = 0; i < pendingComponentsInProgress.length; i++) {
                _loop_2(i);
            }
            //When all are done, stop the progressbar
            if (pendingComponentsInProgress.length === 0) {
                _this._ngProgress.done();
            }
        };
        this._ngProgress.start();
        //To avoid infinite loading...
        setTimeout(function () {
            if (pendingComponentsInProgress.length > 0) {
                alert('The server is too slow, or something went wrong :(');
                pendingComponentsInProgress = [];
                callOnFinish(null);
            }
        }, 1000 * 120);
        return callOnFinish;
    };
    CommonResourceDispatcherService.prototype.getOrgUnitChildern = function (dataset) {
        if (dataset === null || dataset.getSelectedOrgUnit() === null ||
            dataset.getSelectedPrograms() === null) {
            //Do some errorHandling
            return;
        }
        return this._organisationLoaderService.getOrgUnits('api/organisationUnits?fields=[id,displayName,level,coordinates,' +
            'children::size~rename(ChildCount)]&paging=0&filter=ancestors.id:eq:' + dataset.getSelectedOrgUnit().id);
    };
    return CommonResourceDispatcherService;
}());
CommonResourceDispatcherService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [organizationUnitLoader_service_1.OrganizationUnitLoaderService,
        core_2.Logger,
        TrackedEntityLoaderService_service_1.TrackedEntityLoaderService,
        ngx_progressbar_1.NgProgress])
], CommonResourceDispatcherService);
exports.CommonResourceDispatcherService = CommonResourceDispatcherService;
//# sourceMappingURL=CommonResourceDispatcher.service.js.map