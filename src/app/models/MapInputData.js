"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MapInputData {
    constructor(selectedPrograms, selectedOrgUnit, startDate, endDate) {
        this.selectedPrograms = selectedPrograms;
        this.selectedOrgUnit = selectedOrgUnit;
        this.startDate = startDate;
        this.endDate = endDate;
    }
    getSelectedPrograms() {
        return this.selectedPrograms;
    }
    getSelectedOrgUnit() {
        return this.selectedOrgUnit;
    }
    getStartDate() {
        return this.startDate;
    }
    getEndDate() {
        return this.endDate;
    }
    setSelectedPrograms(selectedPrograms) {
        this.selectedPrograms = selectedPrograms;
    }
    setSelectedOrgUnit(selectedOrgUnit) {
        this.selectedOrgUnit = selectedOrgUnit;
    }
    setStartDate(selectedStartDate) {
        this.startDate = selectedStartDate;
    }
    setEndDate(selectedEndDate) {
        this.endDate = selectedEndDate;
    }
}
exports.MapInputData = MapInputData;
//# sourceMappingURL=MapInputData.js.map