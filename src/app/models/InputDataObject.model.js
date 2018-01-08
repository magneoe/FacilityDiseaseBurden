"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InputDataObject = (function () {
    function InputDataObject(selectedPrograms, selectedOrgUnit, startDate, endDate, filterQueryMap) {
        this.selectedPrograms = selectedPrograms;
        this.selectedOrgUnit = selectedOrgUnit;
        this.startDate = startDate;
        this.endDate = endDate;
        this.filterQueryMap = filterQueryMap;
    }
    InputDataObject.prototype.getSelectedPrograms = function () {
        return this.selectedPrograms;
    };
    InputDataObject.prototype.getSelectedOrgUnit = function () {
        return this.selectedOrgUnit;
    };
    InputDataObject.prototype.getStartDate = function () {
        return this.startDate;
    };
    InputDataObject.prototype.getEndDate = function () {
        return this.endDate;
    };
    InputDataObject.prototype.getFilterQueryMap = function () {
        return this.filterQueryMap;
    };
    InputDataObject.prototype.setSelectedPrograms = function (selectedPrograms) {
        this.selectedPrograms = selectedPrograms;
    };
    InputDataObject.prototype.setSelectedOrgUnit = function (selectedOrgUnit) {
        this.selectedOrgUnit = selectedOrgUnit;
    };
    InputDataObject.prototype.setStartDate = function (selectedStartDate) {
        this.startDate = selectedStartDate;
    };
    InputDataObject.prototype.setEndDate = function (selectedEndDate) {
        this.endDate = selectedEndDate;
    };
    InputDataObject.prototype.setFilterQueriesMap = function (filterQueries) {
        this.filterQueryMap = filterQueries;
    };
    InputDataObject.prototype.equals = function (inputDataObject) {
        var _this = this;
        if (inputDataObject.getStartDate() !== this.getStartDate())
            return false;
        if (inputDataObject.getEndDate() !== this.getEndDate())
            return false;
        if (inputDataObject.getSelectedOrgUnit().id !== this.getSelectedOrgUnit().id)
            return false;
        for (var i = 0; i < this.getSelectedPrograms().length; i++) {
            if (inputDataObject.getSelectedPrograms()[i].id !== this.getSelectedPrograms()[i].id)
                return false;
        }
        var iterator = inputDataObject.getFilterQueryMap().keys();
        inputDataObject.getFilterQueryMap().forEach(function (value) {
            var key = iterator.next();
            if (!_this.getFilterQueryMap().has(key.value))
                return false;
        });
        return true;
    };
    return InputDataObject;
}());
exports.InputDataObject = InputDataObject;
//# sourceMappingURL=InputDataObject.model.js.map