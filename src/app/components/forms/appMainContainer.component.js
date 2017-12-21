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
var customValidation_service_1 = require("../../services/customValidation.service");
var map_component_1 = require("../map/map.component");
var TemporalDimension_component_1 = require("../temporal/TemporalDimension.component");
var CommonResourceDispatcher_service_1 = require("../../services/dataInput/CommonResourceDispatcher.service");
var ngx_progressbar_1 = require("ngx-progressbar");
var AppMainContainerComponent = (function () {
    function AppMainContainerComponent(_customValidationService, _commonResourceDispatcher, _ngProgress) {
        var _this = this;
        this._customValidationService = _customValidationService;
        this._commonResourceDispatcher = _commonResourceDispatcher;
        this._ngProgress = _ngProgress;
        this.formIsValid = false;
        this.errorMessages = new Map();
        // Subscribes to the Validation message service used by the child components for sending validation messages.
        this.subscription = this._customValidationService.getErrorMessage().subscribe(function (validationMessage) {
            _this.handleValidationUpdateEvent(validationMessage);
        });
    }
    /*
     * This methods deals with an incomming validation message
     */
    AppMainContainerComponent.prototype.handleValidationUpdateEvent = function (validationMessage) {
        if (!validationMessage.formIsValid)
            this.errorMessages.set(validationMessage.senderId, validationMessage);
        else
            this.errorMessages.delete(validationMessage.senderId);
        if (this.errorMessages.size == 0)
            this.formIsValid = true;
        else
            this.formIsValid = false;
    };
    /*
     * Converts the Validation messages as an array to be iterated in the view
     */
    AppMainContainerComponent.prototype.getErrorMessages = function () {
        var array = new Array();
        this.errorMessages.forEach(function (item) {
            array.push(item);
        });
        return array;
    };
    /*
     * The submitting
     */
    AppMainContainerComponent.prototype.select = function () {
        var _this = this;
        //Make a list of updateable components;
        var updateableComponents = [];
        updateableComponents.push(this.mapComponent);
        updateableComponents.push(this.temporalComponent);
        //The list of components that still not have reported that their are finished
        var pendingComponentsInProgress = [];
        pendingComponentsInProgress = pendingComponentsInProgress.concat(updateableComponents);
        //Upon finshed - remove the component from the pendingComponentsList
        var callOnFinish = function (component) {
            var _loop_1 = function (i) {
                if (pendingComponentsInProgress[i] === component) {
                    pendingComponentsInProgress = pendingComponentsInProgress.filter(function (comp) {
                        if (comp !== pendingComponentsInProgress[i])
                            return true;
                    });
                }
            };
            for (var i = 0; i < pendingComponentsInProgress.length; i++) {
                _loop_1(i);
            }
            //When all are done, stop the progressbar
            if (pendingComponentsInProgress.length === 0) {
                _this._ngProgress.done();
                _this.mapComponent.setView();
            }
        };
        this._ngProgress.start();
        this._commonResourceDispatcher.handleUpdate(updateableComponents, callOnFinish);
    };
    AppMainContainerComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    return AppMainContainerComponent;
}());
__decorate([
    core_1.ViewChild(map_component_1.MapComponent),
    __metadata("design:type", map_component_1.MapComponent)
], AppMainContainerComponent.prototype, "mapComponent", void 0);
__decorate([
    core_1.ViewChild(TemporalDimension_component_1.TemporalDimensionComponent),
    __metadata("design:type", TemporalDimension_component_1.TemporalDimensionComponent)
], AppMainContainerComponent.prototype, "temporalComponent", void 0);
AppMainContainerComponent = __decorate([
    core_1.Component({
        selector: 'app',
        templateUrl: '../../views/appMainContainer.component.html',
        providers: [CommonResourceDispatcher_service_1.CommonResourceDispatcherService]
    })
    /*
     * This component represents the main container for all input forms that sets up the
     * initial search for the map component.
     */
    ,
    __metadata("design:paramtypes", [customValidation_service_1.CustomValidationService,
        CommonResourceDispatcher_service_1.CommonResourceDispatcherService,
        ngx_progressbar_1.NgProgress])
], AppMainContainerComponent);
exports.AppMainContainerComponent = AppMainContainerComponent;
//# sourceMappingURL=appMainContainer.component.js.map