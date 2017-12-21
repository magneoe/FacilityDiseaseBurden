"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var app_component_1 = require("./app.component");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var notfound_component_1 = require("./components/notfound.component");
var forms_1 = require("@angular/forms");
var forms_2 = require("@angular/forms");
var login_service_1 = require("./services/login.service");
var login_component_1 = require("./components/forms/login.component");
var organizationLoader_component_1 = require("./components/forms/org/organizationLoader.component");
var datePicker_component_1 = require("./components/forms/date/datePicker.component");
var organizationLoader_pipe_1 = require("./pipes/organizationLoader.pipe");
var program_component_1 = require("./components/forms/program/program.component");
var programs_service_1 = require("./services/dataLoading/programs.service");
var customValidation_service_1 = require("./services/customValidation.service");
var appMainContainer_component_1 = require("./components/forms/appMainContainer.component");
var map_component_1 = require("./components/map/map.component");
var mapInputData_service_1 = require("./services/dataInput/mapInputData.service");
var programFilter_component_1 = require("./components/forms/program/programFilter.component");
var programFilterAttribute_component_1 = require("./components/forms/program/programFilterAttribute.component");
var TrackedEntityLoaderService_service_1 = require("./services/dataLoading/TrackedEntityLoaderService.service");
var core_2 = require("angular2-logger/core");
var TemporalDimension_component_1 = require("./components/temporal/TemporalDimension.component");
var organizationUnitLoader_service_1 = require("./services/dataLoading/organizationUnitLoader.service");
var ngx_progressbar_1 = require("ngx-progressbar");
var appRoutes = [
    { path: '', component: login_component_1.LoginComponent },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'app', component: appMainContainer_component_1.AppMainContainerComponent, canActivate: [login_service_1.AuthorizationService] },
    { path: '**', component: appMainContainer_component_1.AppMainContainerComponent, canActivate: [login_service_1.AuthorizationService] }
];
// path: '', pathMatch: 'full', redirectTo: ''
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, http_1.HttpModule, router_1.RouterModule.forRoot(appRoutes),
            forms_1.FormsModule, forms_2.ReactiveFormsModule, ngx_progressbar_1.NgProgressModule],
        declarations: [app_component_1.AppComponent, organizationLoader_component_1.OrganizationLoaderComponent, notfound_component_1.PageNotFoundComponent, login_component_1.LoginComponent,
            organizationLoader_pipe_1.OrderByDisplayNamePipe, datePicker_component_1.DatePickerComponent,
            appMainContainer_component_1.AppMainContainerComponent, program_component_1.ProgramsComponent, map_component_1.MapComponent, programFilter_component_1.ProgramFilterComponent, programFilterAttribute_component_1.ProgramFilterAttributeComponent, TemporalDimension_component_1.TemporalDimensionComponent],
        bootstrap: [app_component_1.AppComponent],
        providers: [login_service_1.AuthorizationService, programs_service_1.ProgramsService, customValidation_service_1.CustomValidationService,
            mapInputData_service_1.MapInputDataService, TrackedEntityLoaderService_service_1.TrackedEntityLoaderService,
            organizationUnitLoader_service_1.OrganizationUnitLoaderService, core_2.LOG_LOGGER_PROVIDERS,
        ],
        entryComponents: [programFilter_component_1.ProgramFilterComponent, programFilterAttribute_component_1.ProgramFilterAttributeComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map