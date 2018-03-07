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
var programFilterAttribute_component_1 = require("./programFilterAttribute.component");
var TrackedEntityLoaderService_service_1 = require("../../../services/dataLoading/TrackedEntityLoaderService.service");
var ProgramFilterComponent = (function () {
    function ProgramFilterComponent(_cfr, _trackedEntityLoaderServiceService) {
        this._cfr = _cfr;
        this._trackedEntityLoaderServiceService = _trackedEntityLoaderServiceService;
        this.MAX_FILTERS = 1;
    }
    ProgramFilterComponent.prototype.ngOnInit = function () {
    };
    ProgramFilterComponent.prototype.addAttribute = function () {
        var _this = this;
        this._trackedEntityLoaderServiceService.getTrackedEntityInstances('trackedEntityInstances?ou=' + this.selectedOrgUnit.id +
            '&program=' + this.program.id + '&pageSize=1&fields=[lastUpdated,attributes]&ouMode=DESCENDANTS').
            subscribe(function (units) {
            var attributes = [];
            if (units.trackedEntityInstances[0] !== null && units.trackedEntityInstances[0] !== undefined) {
                attributes = units.trackedEntityInstances[0].attributes;
            }
            var comp = _this._cfr.resolveComponentFactory(programFilterAttribute_component_1.ProgramFilterAttributeComponent);
            var filterAttributeComp = _this.container.createComponent(comp);
            filterAttributeComp.instance._ref = filterAttributeComp;
            filterAttributeComp.instance.setEntityAttributes(attributes);
            filterAttributeComp.instance.setSelectedProgram(_this.program);
            filterAttributeComp.instance.setRecieverAddress(_this.RECIEVER_ADDRESS);
        });
    };
    ProgramFilterComponent.prototype.setRecieverAddress = function (RECIEVER_ADDRESS) {
        this.RECIEVER_ADDRESS = RECIEVER_ADDRESS;
    };
    ProgramFilterComponent.prototype.setProgram = function (program) {
        console.log('Setting program', program);
        this.program = program;
    };
    ProgramFilterComponent.prototype.setSelectedOrgUnit = function (selOrgUnit) {
        this.selectedOrgUnit = selOrgUnit;
    };
    ProgramFilterComponent.prototype.setMaxFilters = function (MAX_FILTERS) {
        this.MAX_FILTERS = MAX_FILTERS;
    };
    return ProgramFilterComponent;
}());
__decorate([
    core_1.ViewChild('filterAttributes', { read: core_1.ViewContainerRef }),
    __metadata("design:type", core_1.ViewContainerRef)
], ProgramFilterComponent.prototype, "container", void 0);
ProgramFilterComponent = __decorate([
    core_1.Component({
        selector: 'programFilter',
        templateUrl: '../../../views/program/programFilter.component.html'
    }),
    __metadata("design:paramtypes", [core_1.ComponentFactoryResolver,
        TrackedEntityLoaderService_service_1.TrackedEntityLoaderService])
], ProgramFilterComponent);
exports.ProgramFilterComponent = ProgramFilterComponent;
//# sourceMappingURL=programFilter.component.js.map