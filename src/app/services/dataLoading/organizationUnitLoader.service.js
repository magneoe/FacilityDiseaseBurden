"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/do");
require("rxjs/add/operator/catch");
var core_1 = require("@angular/core");
var HttpWrapper_service_1 = require("./HttpWrapper.service");
/*
 * This service supports the organisation loader component -
 * A lot of the supporting methods from the component are placed here,
 * to increase reuse. Also, this service is stateless.
 */
var OrganizationUnitLoaderService = (function (_super) {
    __extends(OrganizationUnitLoaderService, _super);
    function OrganizationUnitLoaderService(_http) {
        return _super.call(this, _http, JSON.parse(sessionStorage.getItem("user"))) || this;
    }
    OrganizationUnitLoaderService.prototype.getOrgUnits = function (query) {
        return this.get(query).do(function (data) { return console.log(JSON.stringify(data)); }).catch(this.handleError);
    };
    /*
      * Implements the HttpWrapper methods
      */
    OrganizationUnitLoaderService.prototype.getAsArray = function (res) {
        return res.json();
    };
    OrganizationUnitLoaderService.prototype.handleError = function (error) {
        console.error(error);
        return Observable_1.Observable.throw(error.json().error());
    };
    OrganizationUnitLoaderService.prototype.findSelectedOrgUnit = function (ancestorId, organisationUnits) {
        var orgUnitsAtGivenLevel = organisationUnits;
        var org = null;
        if (ancestorId.startsWith("Choose"))
            return org;
        do {
            if ((org = orgUnitsAtGivenLevel.find(function (org) { return org.id === ancestorId; })) != null) {
                return org;
            }
        } while ((orgUnitsAtGivenLevel = orgUnitsAtGivenLevel.find(function (org) { return org.selected === true; }).children) != null);
    };
    OrganizationUnitLoaderService.prototype.findChildrenOfSelectedOrgUnit = function (level, numberOfLevels, organisationUnits) {
        var orgUnitsAtGivenLevel = organisationUnits;
        for (var i = 0; i < numberOfLevels; i++) {
            if (i + 1 == level) {
                return orgUnitsAtGivenLevel;
            }
            orgUnitsAtGivenLevel = orgUnitsAtGivenLevel.find(function (org) { return org.selected === true; }).children;
        }
    };
    OrganizationUnitLoaderService.prototype.setLevel = function (selectedOrgUnit, level, levels, organisationUnits) {
        var orgUnitsAtLevel = this.findChildrenOfSelectedOrgUnit(level, levels.length, organisationUnits);
        orgUnitsAtLevel.map(function (org) { return org.selected = false; });
        orgUnitsAtLevel.map(function (org) { return org.children = []; });
        if (selectedOrgUnit != null)
            selectedOrgUnit.selected = true;
        if (levels.length > level)
            levels = levels.slice(0, level);
        return levels;
    };
    OrganizationUnitLoaderService.prototype.findSelectOrgUnit = function (lvl, numberOfLevels, organisationUnits) {
        var orgUnitsAtGivenLevel = organisationUnits;
        for (var i = 0; i < numberOfLevels; i++) {
            if (i + 1 == lvl) {
                return orgUnitsAtGivenLevel.find(function (org) { return org.selected === true; });
            }
            orgUnitsAtGivenLevel = orgUnitsAtGivenLevel.find(function (org) { return org.selected === true; }).children;
        }
    };
    return OrganizationUnitLoaderService;
}(HttpWrapper_service_1.HttpWrapperService));
OrganizationUnitLoaderService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], OrganizationUnitLoaderService);
exports.OrganizationUnitLoaderService = OrganizationUnitLoaderService;
//# sourceMappingURL=organizationUnitLoader.service.js.map