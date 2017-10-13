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
const core_1 = require("@angular/core");
const programs_service_1 = require("../../services/programs.service");
const customValidation_service_1 = require("../../services/customValidation.service");
const ValidationMessage_1 = require("../../models/ValidationMessage");
const mapInputData_service_1 = require("../../services/mapInputData.service");
const MapInputData_1 = require("../../models/MapInputData");
let ProgramsComponent = 
/*
 * This component represent DHIS2 programs loaded into checkboxes in the view.
 *
 */
class ProgramsComponent {
    constructor(_progService, _customValidationService, _mapInputDataService) {
        this._progService = _progService;
        this._customValidationService = _customValidationService;
        this._mapInputDataService = _mapInputDataService;
        this.programs = [];
        this.senderId = "programPicker";
    }
    /*
     * Upon changes in the input (organisationUnit), then reload the programs
     */
    ngOnChanges(changes) {
        this.showPrograms(this.selectedOrgUnit);
    }
    ngOnInit() {
        this.notifyValueChange(null);
    }
    /*
     * Loads the programs thats connected to a given org.unit
     */
    showPrograms(orgUnit) {
        if (orgUnit == null) {
            this.programs = [];
            return;
        }
        this.query = 'api/organisationUnits?filter=id:eq:' + orgUnit.id + '&fields=programs[id,displayName]&paging=0';
        this._progService.loadPrograms(this.query)
            .subscribe((units) => {
            this.programs = units.organisationUnits[0].programs;
            this.notifyValueChange(null);
        });
    }
    /*
     * Send a ValidationMessage upon changes in the checkbox selection
     */
    notifyValueChange(event) {
        this.programs = this._progService.setSelectedProgram(event, this.programs);
        let validationMessage = new ValidationMessage_1.ValidationMessage();
        validationMessage.senderId = this.senderId;
        validationMessage.errorMessage = this.getErrors().toString();
        validationMessage.formIsValid = (this.getErrors().length > 0 ? false : true);
        this._customValidationService.sendMessage(validationMessage);
        let mapInputData = new MapInputData_1.MapInputData(this.getSelectedPrograms(), null, null, null);
        this._mapInputDataService.sendMessage(mapInputData);
    }
    /*
     * Composes error messages
     */
    getErrors() {
        let errors = new Array();
        for (let i = 0; i < this.programs.length; i++) {
            if (this.programs[i].isSelected)
                return errors;
        }
        errors.push("No programs selected");
        return errors;
    }
    /*
     * Helper method
     */
    getSelectedPrograms() {
        let selectedProgs = new Array();
        this.programs.forEach(prog => {
            if (prog.isSelected)
                selectedProgs.push(prog);
        });
        return selectedProgs;
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ProgramsComponent.prototype, "selectedOrgUnit", void 0);
ProgramsComponent = __decorate([
    core_1.Component({
        selector: 'programPicker',
        templateUrl: '../../views/programs.component.html',
        providers: [programs_service_1.ProgramsService]
    })
    /*
     * This component represent DHIS2 programs loaded into checkboxes in the view.
     *
     */
    ,
    __metadata("design:paramtypes", [programs_service_1.ProgramsService, customValidation_service_1.CustomValidationService,
        mapInputData_service_1.MapInputDataService])
], ProgramsComponent);
exports.ProgramsComponent = ProgramsComponent;
//# sourceMappingURL=programs.component.js.map