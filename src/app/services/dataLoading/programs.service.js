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
const http_1 = require("@angular/http");
const Observable_1 = require("rxjs/Observable");
const HttpWrapper_service_1 = require("./dataLoading/HttpWrapper.service");
/*
 * This service supports the programs component.
 * Increased reuse of code - stateless service
 */
let ProgramsService = class ProgramsService extends HttpWrapper_service_1.HttpWrapperService {
    constructor(_http) {
        super(_http, JSON.parse(sessionStorage.getItem("user")));
    }
    loadPrograms(query) {
        return this.get(query).do(data => console.log(JSON.stringify(data))).catch(this.handleError);
    }
    /*
     * Implements the HttpWrapper service methods
     */
    getAsArray(res) {
        return res.json();
    }
    handleError(error) {
        console.error(error);
        return Observable_1.Observable.throw(error.json().error());
    }
    setSelectedProgram(event, programs) {
        if (event == null || event === undefined)
            return programs;
        for (let i = 0; i < programs.length; i++) {
            if (programs[i].id == event.target.value)
                programs[i].isSelected = event.target.checked;
        }
        return programs;
    }
};
ProgramsService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], ProgramsService);
exports.ProgramsService = ProgramsService;
//# sourceMappingURL=programs.service.js.map
