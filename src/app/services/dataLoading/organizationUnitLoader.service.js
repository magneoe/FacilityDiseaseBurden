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
const http_1 = require("@angular/http");
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/do");
require("rxjs/add/operator/catch");
const core_1 = require("@angular/core");
const HttpWrapper_service_1 = require("./dataLoading/HttpWrapper.service");
/*
 * This service supports the organisation loader component -
 * A lot of the supporting methods from the component are placed here,
 * to increase reuse. Also, this service is stateless.
 */
let OrganizationUnitLoaderService = class OrganizationUnitLoaderService extends HttpWrapper_service_1.HttpWrapperService {
    constructor(_http) {
        super(_http, JSON.parse(sessionStorage.getItem("user")));
    }
    getOrgUnits(query) {
        return this.get(query).do(data => console.log(JSON.stringify(data))).catch(this.handleError);
    }
    /*
      * Implements the HttpWrapper methods
      */
    getAsArray(res) {
        return res.json();
    }
    handleError(error) {
        console.error(error);
        return Observable_1.Observable.throw(error.json().error());
    }
    findSelectedOrgUnit(ancestorId, organisationUnits) {
        var orgUnitsAtGivenLevel = organisationUnits;
        var org = null;
        if (ancestorId.startsWith("Choose"))
            return org;
        do {
            if ((org = orgUnitsAtGivenLevel.find(org => org.id === ancestorId)) != null) {
                return org;
            }
        } while ((orgUnitsAtGivenLevel = orgUnitsAtGivenLevel.find(org => org.selected === true).children) != null);
    }
    findChildrenOfSelectedOrgUnit(level, numberOfLevels, organisationUnits) {
        var orgUnitsAtGivenLevel = organisationUnits;
        for (var i = 0; i < numberOfLevels; i++) {
            if (i + 1 == level) {
                return orgUnitsAtGivenLevel;
            }
            orgUnitsAtGivenLevel = orgUnitsAtGivenLevel.find(org => org.selected === true).children;
        }
    }
    setLevel(selectedOrgUnit, level, levels, organisationUnits) {
        var orgUnitsAtLevel = this.findChildrenOfSelectedOrgUnit(level, levels.length, organisationUnits);
        orgUnitsAtLevel.map(org => org.selected = false);
        orgUnitsAtLevel.map(org => org.children = []);
        if (selectedOrgUnit != null)
            selectedOrgUnit.selected = true;
        if (levels.length > level)
            levels = levels.slice(0, level);
        return levels;
    }
    findSelectOrgUnit(lvl, numberOfLevels, organisationUnits) {
        var orgUnitsAtGivenLevel = organisationUnits;
        for (var i = 0; i < numberOfLevels; i++) {
            if (i + 1 == lvl) {
                return orgUnitsAtGivenLevel.find(org => org.selected === true);
            }
            orgUnitsAtGivenLevel = orgUnitsAtGivenLevel.find(org => org.selected === true).children;
        }
    }
};
OrganizationUnitLoaderService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], OrganizationUnitLoaderService);
exports.OrganizationUnitLoaderService = OrganizationUnitLoaderService;
//# sourceMappingURL=organizationUnitLoader.service.js.map
