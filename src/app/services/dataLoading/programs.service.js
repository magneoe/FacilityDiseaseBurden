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
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
var HttpWrapper_service_1 = require("./HttpWrapper.service");
/*
 * This service supports the programs component.
 * Increased reuse of code - stateless service
 */
var ProgramsService = (function (_super) {
    __extends(ProgramsService, _super);
    function ProgramsService(_http) {
        return _super.call(this, _http, JSON.parse(sessionStorage.getItem("user"))) || this;
    }
    ProgramsService.prototype.loadPrograms = function (query) {
        return this.get(query).do(function (data) { return JSON.stringify(data); }).catch(this.handleError);
    };
    /*
     * Implements the HttpWrapper service methods
     */
    ProgramsService.prototype.getAsArray = function (res) {
        return res.json();
    };
    ProgramsService.prototype.handleError = function (error) {
        console.error(error);
        return Observable_1.Observable.throw(error.json().error());
    };
    return ProgramsService;
}(HttpWrapper_service_1.HttpWrapperService));
ProgramsService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], ProgramsService);
exports.ProgramsService = ProgramsService;
//# sourceMappingURL=programs.service.js.map