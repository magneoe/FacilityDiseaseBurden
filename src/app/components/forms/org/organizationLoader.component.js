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
const organizationUnitLoader_service_1 = require("../../services/dataLoading/organizationUnitLoader.service");
const organizationLoader_pipe_1 = require("../../pipes/organizationLoader.pipe");
const programs_component_1 = require("./program/program.component");
const ValidationMessage_1 = require("../../models/ValidationMessage.model");
const customValidation_service_1 = require("../../services/customValidation.service");
const mapInputData_service_1 = require("../../services/dataInput/mapInputData.service");
const MapInputData_1 = require("../../models/InputDataObject.model");
let OrganizationLoaderComponent =
/*
 * This component represent the loading of organisation units from the hiarcky
 * manifested in a multi level drop down list in the view.
 */
class OrganizationLoaderComponent {
    constructor(_orgLoaderService, _customValidationService, _mapInputDataService) {
        this._orgLoaderService = _orgLoaderService;
        this._customValidationService = _customValidationService;
        this._mapInputDataService = _mapInputDataService;
        this.levels = [1];
        this.isLoading = false;
        this.senderId = "organisationPicker";
    }
    /*
     * When ever at change in the picking of organisation units - revalidate the form and notice the master component.
     */
    notifyValueChange(event) {
        let validationMessage = new ValidationMessage_1.ValidationMessage();
        validationMessage.senderId = this.senderId;
        validationMessage.errorMessage = this.getErrors().toString();
        validationMessage.formIsValid = (this.getErrors().length > 0 ? false : true);
        this._customValidationService.sendMessage(validationMessage);
        let mapInputData = new MapInputData_1.MapInputData(null, this.selectedOrgUnit, null, null);
        this._mapInputDataService.sendMessage(mapInputData);
    }
    /*
     * Loading the root level in the hiarcky
     */
    ngOnInit() {
        this.isLoading = true;
        this._orgLoaderService.getOrgUnits('api/organisationUnits?level=1&paging=0&fields=id,displayName,level')
            .subscribe((units) => {
            this.organizationUnits = units.organisationUnits;
        });
        this.isLoading = false;
        this.notifyValueChange(null);
    }
    /*
     * Loads a designated level, on the basis of a given ancestor id.
     */
    loadLevel(ancestorId, lvl) {
        this.isLoading = true;
        //Fetch the particular ancestor from the array
        this.selectedOrgUnit = this._orgLoaderService.findSelectedOrgUnit(ancestorId, this.organizationUnits);
        //Re-arranging the levels
        this.levels = this._orgLoaderService.setLevel(this.selectedOrgUnit, lvl, this.levels, this.organizationUnits);
        //Loading children of the ancestor - if there is one or if its been loaded previously.
        if (this.selectedOrgUnit != null) {
            this.query = 'api/organisationUnits?filter=id:eq:' + ancestorId + '&fields=children[id,displayName,level,coordinates]&paging=0';
            this._orgLoaderService.getOrgUnits(this.query)
                .subscribe((units) => {
                //Loads the children of the ancestor
                this.selectedOrgUnit.children = units.organisationUnits[0].children;
                //If there are any children - we need to add another level/drop down list in the view
                if (this.selectedOrgUnit.children.length > 0)
                    this.levels.push(this.levels.length + 1);
            });
        }
        else if (lvl > 1) {
            this.selectedOrgUnit = this._orgLoaderService.findSelectOrgUnit(lvl - 1, this.levels.length, this.organizationUnits);
            console.log('Else if:', lvl);
            console.log('Org unit selected:', this.selectedOrgUnit);
        }
        this.isLoading = false;
        this.notifyValueChange(null);
    }
    /*
     * Gets children of on a particular level
     */
    findChildrenOfSelectedOrgUnit(lvl) {
        return this._orgLoaderService.findChildrenOfSelectedOrgUnit(lvl, this.levels.length, this.organizationUnits);
    }
    /*
     * Used for composing the validation message
     */
    getErrors() {
        let errorMessages = new Array();
        if (this.selectedOrgUnit == null) {
            errorMessages.push("OrgUnit not set");
            console.log('errors:', errorMessages);
        }
        return errorMessages;
    }
};
OrganizationLoaderComponent = __decorate([
    core_1.Component({
        selector: 'organisationPicker',
        templateUrl: '../../../views/organizationLoader.component.html',
        providers: [organizationUnitLoader_service_1.OrganizationUnitLoaderService, organizationLoader_pipe_1.OrderByDisplayNamePipe, programs_component_1.ProgramsComponent]
    })
    /*
     * This component represent the loading of organisation units from the hiarcky
     * manifested in a multi level drop down list in the view.
     */
    ,
    __metadata("design:paramtypes", [organizationUnitLoader_service_1.OrganizationUnitLoaderService,
        customValidation_service_1.CustomValidationService,
        mapInputData_service_1.MapInputDataService])
], OrganizationLoaderComponent);
exports.OrganizationLoaderComponent = OrganizationLoaderComponent;
//# sourceMappingURL=organizationLoader.component.js.map
