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
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
var router_1 = require("@angular/router");
var AuthorizationService = (function () {
    function AuthorizationService(_http, _router) {
        this._http = _http;
        this._router = _router;
        this.authorizationMessage = "";
        this.options = new http_1.RequestOptions({
            method: 'GET',
            headers: new http_1.Headers()
        });
    }
    /*
     * Method used for testing connectivity/validity of username/password
     */
    AuthorizationService.prototype.testConnectivity = function (user) {
        this.options.headers.set('Authorization', 'Basic ' + btoa(user.getUsername() + ':' + user.getPassword()));
        console.log("Header", this.options.headers);
        return this._http.get(user.getConnectionLink(), this.options).map(function (response) { return response.json(); }).catch(this.handleError);
    };
    AuthorizationService.prototype.login = function (user) {
        var _this = this;
        this.getServerUrl("manifest.webapp").subscribe(function (data) {
            var apiBaseUrl = data.activities.dhis.href + '/api';
            user.setConnectionLink(apiBaseUrl);
            _this.testConnectivity(user).subscribe(function (isSuccess) {
                //Setting user info in session storage
                sessionStorage.setItem("user", JSON.stringify(user));
                //Directing to orgLoader whenever logged in
                _this._router.navigate(['/app']);
                _this.authorizationMessage = "Success";
            }, function (error) {
                _this.authorizationMessage = "Wrong username/password";
            });
        });
    };
    //Authorization service function
    AuthorizationService.prototype.canActivate = function (route, state) {
        //Whenever not authenticated - navigate to login page
        if (sessionStorage.getItem("user") == null) {
            this._router.navigate(['/login']);
            return false;
        }
        return true;
    };
    /*
     * Support functions
     */
    AuthorizationService.prototype.handleError = function (error) {
        console.error('Catch:', error);
        return Observable_1.Observable.throw(error.json().error());
    };
    AuthorizationService.prototype.getServerUrl = function (filePath) {
        var _this = this;
        return this._http.get(filePath).map(function (res) { return res.json(); }).catch(function (error) { return _this.handleError(error); });
    };
    return AuthorizationService;
}());
AuthorizationService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, router_1.Router])
], AuthorizationService);
exports.AuthorizationService = AuthorizationService;
//# sourceMappingURL=login.service.js.map