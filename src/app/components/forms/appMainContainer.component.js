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
const customValidation_service_1 = require("../../services/customValidation.service");
const mapInputData_service_1 = require("../../services/mapInputData.service");
let AppMainContainerComponent = 
/*
 * This component represents the main container for all input forms that sets up the
 * initial search for the map component.
 */
class AppMainContainerComponent {
    constructor(_customValidationService, _mapInputDataService) {
        this._customValidationService = _customValidationService;
        this._mapInputDataService = _mapInputDataService;
        this.formIsValid = false;
        this.errorMessages = new Map();
        //Subscribes to the Validation message service used by the child components for sending validation messages.
        this.subscription = this._customValidationService.getErrorMessage().subscribe(validationMessage => {
            this.handleValidationUpdateEvent(validationMessage);
        });
    }
    /*
     * This methods deals with an incomming validation message
     */
    handleValidationUpdateEvent(validationMessage) {
        if (!validationMessage.formIsValid)
            this.errorMessages.set(validationMessage.senderId, validationMessage);
        else
            this.errorMessages.delete(validationMessage.senderId);
        if (this.errorMessages.size == 0)
            this.formIsValid = true;
        else
            this.formIsValid = false;
    }
    /*
     * Converts the Validation messages as an array to be iterated in the view
     */
    getErrorMessages() {
        let array = new Array();
        this.errorMessages.forEach(item => {
            array.push(item);
        });
        return array;
    }
    /*
     * The submitting
     */
    select() {
        //Happy day scenario
        //let message = 'Selected orgOrg name: ' +
        //"Date range: from" + this.datePicker.getStartDate().toLocaleDateString('en-GB') + ' to: ' + this.datePicker.getEndDate().toLocaleDateString('en-GB');
        console.log('Select pushed!');
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
};
AppMainContainerComponent = __decorate([
    core_1.Component({
        selector: 'app',
        templateUrl: '../../views/appMainContainer.component.html',
    })
    /*
     * This component represents the main container for all input forms that sets up the
     * initial search for the map component.
     */
    ,
    __metadata("design:paramtypes", [customValidation_service_1.CustomValidationService,
        mapInputData_service_1.MapInputDataService])
], AppMainContainerComponent);
exports.AppMainContainerComponent = AppMainContainerComponent;
//# sourceMappingURL=appMainContainer.component.js.map