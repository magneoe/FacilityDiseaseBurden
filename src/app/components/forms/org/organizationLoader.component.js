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
var organizationUnitLoader_service_1 = require("../../../services/dataLoading/organizationUnitLoader.service");
var organizationLoader_pipe_1 = require("../../../pipes/organizationLoader.pipe");
var program_component_1 = require("../program/program.component");
var mapInputData_service_1 = require("../../../services/dataInput/mapInputData.service");
var InputDataMessage_model_1 = require("../../../models/InputDataMessage.model");
var InputDataContent_enum_1 = require("../../../enums/InputDataContent.enum");
var OrganizationLoaderComponent = (function () {
    function OrganizationLoaderComponent(_orgLoaderService, _mapInputDataService) {
        this._orgLoaderService = _orgLoaderService;
        this._mapInputDataService = _mapInputDataService;
        this.levels = [1];
        this.isLoading = false;
    }
    /*
     * When ever at change in the picking of organisation units - revalidate the form and notice the master component.
     */
    OrganizationLoaderComponent.prototype.notifyValueChange = function (event) {
        var inputDataMessage = new InputDataMessage_model_1.InputDataMessage(null, InputDataContent_enum_1.InputDataContent.ORG_UNIT, this.selectedOrgUnit);
        this._mapInputDataService.sendInputDataMessage(inputDataMessage);
    };
    /*
     * Loading the root level in the hiarcky
     */
    OrganizationLoaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isLoading = true;
        this._orgLoaderService.getOrgUnits('api/organisationUnits?level=1&paging=0&fields=id,displayName,level')
            .subscribe(function (units) {
            _this.organizationUnits = units.organisationUnits;
        });
        this.isLoading = false;
        this.notifyValueChange(null);
    };
    /*
     * Loads a designated level, on the basis of a given ancestor id.
     */
    OrganizationLoaderComponent.prototype.loadLevel = function (ancestorId, lvl) {
        var _this = this;
        this.isLoading = true;
        //Fetch the particular ancestor from the array
        this.selectedOrgUnit = this._orgLoaderService.findSelectedOrgUnit(ancestorId, this.organizationUnits);
        //Re-arranging the levels
        this.levels = this._orgLoaderService.setLevel(this.selectedOrgUnit, lvl, this.levels, this.organizationUnits);
        //Loading children of the ancestor - if there is one or if its been loaded previously.
        if (this.selectedOrgUnit != null) {
            this.query = 'api/organisationUnits?filter=id:eq:' + ancestorId + '&fields=children[id,displayName,level,coordinates]&paging=0';
            this._orgLoaderService.getOrgUnits(this.query)
                .subscribe(function (units) {
                //Loads the children of the ancestor
                _this.selectedOrgUnit.children = units.organisationUnits[0].children;
                //If there are any children - we need to add another level/drop down list in the view
                if (_this.selectedOrgUnit.children.length > 0)
                    _this.levels.push(_this.levels.length + 1);
            });
        }
        else if (lvl > 1) {
            this.selectedOrgUnit = this._orgLoaderService.findSelectOrgUnitAtGivenLevel(lvl - 1, this.levels.length, this.organizationUnits);
        }
        this.isLoading = false;
        this.notifyValueChange(null);
    };
    /*
     * Gets children of on a particular level
     */
    OrganizationLoaderComponent.prototype.findChildrenOfSelectedOrgUnit = function (lvl) {
        return this._orgLoaderService.findChildrenOfSelectedOrgUnit(lvl, this.levels.length, this.organizationUnits);
    };
    return OrganizationLoaderComponent;
}());
OrganizationLoaderComponent = __decorate([
    core_1.Component({
        selector: 'organisationPicker',
        templateUrl: '../../../views/organizationLoader.component.html',
        providers: [organizationUnitLoader_service_1.OrganizationUnitLoaderService, organizationLoader_pipe_1.OrderByDisplayNamePipe, program_component_1.ProgramsComponent]
    })
    /*
     * This component represent the loading of organisation units from the hiarcky
     * manifested in a multi level drop down list in the view.
     */
    ,
    __metadata("design:paramtypes", [organizationUnitLoader_service_1.OrganizationUnitLoaderService,
        mapInputData_service_1.MapInputDataService])
], OrganizationLoaderComponent);
exports.OrganizationLoaderComponent = OrganizationLoaderComponent;
//# sourceMappingURL=organizationLoader.component.js.map