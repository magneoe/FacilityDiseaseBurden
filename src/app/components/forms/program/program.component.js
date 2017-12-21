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
var programs_service_1 = require("../../../services/dataLoading/programs.service");
var customValidation_service_1 = require("../../../services/customValidation.service");
var ValidationMessage_model_1 = require("../../../models/ValidationMessage.model");
var mapInputData_service_1 = require("../../../services/dataInput/mapInputData.service");
var programFilter_component_1 = require("./programFilter.component");
var InputDataMessage_model_1 = require("../../../models/InputDataMessage.model");
var InputDataContent_enum_1 = require("../../../enums/InputDataContent.enum");
var ProgramsComponent = (function () {
    function ProgramsComponent(_progService, _customValidationService, _mapInputDataService, _cfr) {
        this._progService = _progService;
        this._customValidationService = _customValidationService;
        this._mapInputDataService = _mapInputDataService;
        this._cfr = _cfr;
        this.programs = [];
        this.senderId = "programPicker";
    }
    /*
     * Upon changes in the input (organisationUnit), then reload the programs
     */
    ProgramsComponent.prototype.ngOnChanges = function (changes) {
        this.showPrograms(this.selectedOrgUnit);
    };
    ProgramsComponent.prototype.ngOnInit = function () {
        this.notifyValueChange(null);
    };
    /*
     * Loads the programs thats connected to a given org.unit
     */
    ProgramsComponent.prototype.showPrograms = function (orgUnit) {
        var _this = this;
        if (orgUnit == null) {
            this.programs = [];
            return;
        }
        this.query = 'api/organisationUnits?filter=id:eq:' + orgUnit.id + '&fields=programs[id,displayName]&paging=0';
        this._progService.loadPrograms(this.query)
            .subscribe(function (units) {
            _this.programs = units.organisationUnits[0].programs;
            _this.notifyValueChange(null);
        });
    };
    /*
     * Send a ValidationMessage upon changes in the checkbox selection
     */
    ProgramsComponent.prototype.notifyValueChange = function (event) {
        this.container.clear();
        this.programs = this._progService.setSelectedProgram(event, this.programs);
        var validationMessage = new ValidationMessage_model_1.ValidationMessage();
        validationMessage.senderId = this.senderId;
        validationMessage.errorMessage = this.getErrors().toString();
        validationMessage.formIsValid = (this.getErrors().length > 0 ? false : true);
        this._customValidationService.sendMessage(validationMessage);
        for (var i = 0; i < this.getSelectedPrograms().length; i++) {
            var comp = this._cfr.resolveComponentFactory(programFilter_component_1.ProgramFilterComponent);
            var filterComp = this.container.createComponent(comp);
            filterComp.instance._ref = filterComp;
            filterComp.instance.program = this.getSelectedPrograms()[i];
            filterComp.instance.selectedOrgUnit = this.selectedOrgUnit;
        }
        //Send datamessage to CommonResourceDistpatcher service.
        var inputDataMessage = new InputDataMessage_model_1.InputDataMessage(null, InputDataContent_enum_1.InputDataContent.PROGRAMS, this.programs.filter(function (prog) { return prog.isSelected; }));
        this._mapInputDataService.sendInputDataMessage(inputDataMessage);
    };
    /*
     * Composes error messages
     */
    ProgramsComponent.prototype.getErrors = function () {
        var errors = new Array();
        for (var i = 0; i < this.programs.length; i++) {
            if (this.programs[i].isSelected)
                return errors;
        }
        errors.push("No programs selected");
        return errors;
    };
    /*
     * Helper method
     */
    ProgramsComponent.prototype.getSelectedPrograms = function () {
        var selectedProgs = new Array();
        this.programs.forEach(function (prog) {
            if (prog.isSelected)
                selectedProgs.push(prog);
        });
        return selectedProgs;
    };
    return ProgramsComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ProgramsComponent.prototype, "selectedOrgUnit", void 0);
__decorate([
    core_1.ViewChild('programFilterContainer', { read: core_1.ViewContainerRef }),
    __metadata("design:type", core_1.ViewContainerRef)
], ProgramsComponent.prototype, "container", void 0);
ProgramsComponent = __decorate([
    core_1.Component({
        selector: 'programPicker',
        templateUrl: '../../../views/program/program.component.html',
        providers: [programs_service_1.ProgramsService]
    })
    /*
     * This component represent DHIS2 programs loaded into checkboxes in the view.
     *
     */
    ,
    __metadata("design:paramtypes", [programs_service_1.ProgramsService, customValidation_service_1.CustomValidationService,
        mapInputData_service_1.MapInputDataService, core_1.ComponentFactoryResolver])
], ProgramsComponent);
exports.ProgramsComponent = ProgramsComponent;
//# sourceMappingURL=program.component.js.map