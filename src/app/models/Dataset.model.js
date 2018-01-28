"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dataset = (function () {
    function Dataset(datasetId, color, selectedPrograms, selectedOrgUnit, startDate, endDate, filterQueryMap) {
        this.datasetId = datasetId;
        this.color = color;
        this.selectedPrograms = selectedPrograms;
        this.selectedOrgUnit = selectedOrgUnit;
        this.startDate = startDate;
        this.endDate = endDate;
        this.filterQueryMap = filterQueryMap;
        this.trackedEntitiyQueries = new Map();
        this.trackedEntitiyResults = new Map();
        this.entitiesInTotal = 0;
    }
    Dataset.prototype.getEntitiesInTotal = function () {
        return this.entitiesInTotal;
    };
    Dataset.prototype.setEntitiesInTotal = function (total) {
        this.entitiesInTotal = total;
    };
    Dataset.prototype.addTrackedEntityQuery = function (subOrgUnit, trackedEntityObservables) {
        this.trackedEntitiyQueries.set(subOrgUnit, trackedEntityObservables);
    };
    Dataset.prototype.getTrackedEntityQueryMap = function () {
        return this.trackedEntitiyQueries;
    };
    Dataset.prototype.addTrackedEntityResults = function (orgUnit, trackedEntities) {
        this.trackedEntitiyResults.set(orgUnit, trackedEntities);
    };
    Dataset.prototype.getTrackedEntityResults = function () {
        return this.trackedEntitiyResults;
    };
    Dataset.prototype.getSelectedPrograms = function () {
        return this.selectedPrograms;
    };
    Dataset.prototype.getSelectedOrgUnit = function () {
        return this.selectedOrgUnit;
    };
    Dataset.prototype.getStartDate = function () {
        return this.startDate;
    };
    Dataset.prototype.getEndDate = function () {
        return this.endDate;
    };
    Dataset.prototype.getFilterQueryMap = function () {
        return this.filterQueryMap;
    };
    Dataset.prototype.getDatasetId = function () {
        return this.datasetId;
    };
    Dataset.prototype.getColor = function () {
        return this.color;
    };
    Dataset.prototype.setSelectedPrograms = function (selectedPrograms) {
        this.selectedPrograms = selectedPrograms;
    };
    Dataset.prototype.setSelectedOrgUnit = function (selectedOrgUnit) {
        this.selectedOrgUnit = selectedOrgUnit;
    };
    Dataset.prototype.setStartDate = function (selectedStartDate) {
        this.startDate = selectedStartDate;
    };
    Dataset.prototype.setEndDate = function (selectedEndDate) {
        this.endDate = selectedEndDate;
    };
    Dataset.prototype.setFilterQueriesMap = function (filterQueries) {
        this.filterQueryMap = filterQueries;
    };
    Dataset.prototype.setAddHistoricEnrollments = function (addHistoricEnrollments) {
        this.addHistoricEnrollments = addHistoricEnrollments;
    };
    Dataset.prototype.getAddHistoricEnrollments = function () {
        return this.addHistoricEnrollments;
    };
    Dataset.prototype.equals = function (dataset) {
        if (dataset.getDatasetId() !== this.datasetId)
            return false;
        return true;
    };
    return Dataset;
}());
exports.Dataset = Dataset;
//# sourceMappingURL=Dataset.model.js.map