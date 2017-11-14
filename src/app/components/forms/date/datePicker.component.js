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
const ValidationMessage_1 = require("../../models/ValidationMessage.model");
const mapInputData_service_1 = require("../../services/dataInput/mapInputData.service");
const MapInputData_1 = require("../../models/InputDataObject.model");
let DatePickerComponent =
/*
 * This component represents a datepicking form.
 */
class DatePickerComponent {
    constructor(_customValidationService, _mapInputDataService) {
        this._customValidationService = _customValidationService;
        this._mapInputDataService = _mapInputDataService;
        this.senderId = "datePicker";
    }
    ngOnInit() {
        this.notifyValueChange(null);
    }
    /*
     * Upon any event in the view (picking dates) this methods is called
     */
    notifyValueChange(event) {
        let validationMessage = new ValidationMessage_1.ValidationMessage();
        validationMessage.senderId = this.senderId;
        validationMessage.errorMessage = this.getErrors().toString();
        validationMessage.formIsValid = (this.getErrors().length > 0 ? false : true);
        this._customValidationService.sendMessage(validationMessage);
        let mapInputData = new MapInputData_1.MapInputData(null, null, this.startDate, this.endDate);
        this._mapInputDataService.sendMessage(mapInputData);
    }
    /*
     * A local validation method - composing the errors
     */
    getErrors() {
        let errors = new Array();
        if (this.startDate == null || this.startDate === undefined)
            errors.push('Start date not set');
        if (this.endDate == null || this.endDate === undefined)
            errors.push('End date not set');
        if (this.startDate != null && this.endDate != null && this.startDate > this.endDate)
            errors.push('End date must be after startdate');
        console.log('errors:', errors);
        return errors;
    }
};
DatePickerComponent = __decorate([
    core_1.Component({
        selector: 'datePicker',
        templateUrl: '../../../views/datePicker.component.html',
    })
    /*
     * This component represents a datepicking form.
     */
    ,
    __metadata("design:paramtypes", [customValidation_service_1.CustomValidationService,
        mapInputData_service_1.MapInputDataService])
], DatePickerComponent);
exports.DatePickerComponent = DatePickerComponent;
//# sourceMappingURL=datePicker.component.js.map
