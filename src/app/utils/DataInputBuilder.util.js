"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var FilterOperation_enum_1 = require("../enums/FilterOperation.enum");
var MapObjectFactory_util_1 = require("./MapObjectFactory.util");
var Dataset_model_1 = require("../models/Dataset.model");
/*
 * What: This is a builder class for constructing InputDataObjects for
 * mapcomponent and temporal component
 *
 * Why: Multiple sources (datapicker, programcomponent and organisationLoaderComponent)
 * are loosely coupled to the CommonResourceResolver, which uses this class to maintain and build inputdataObject
 * upon request.
 * The builder is a easy way to maintain the lastest incomming datas.
 */
var DataInputBuilderUtil = (function () {
    function DataInputBuilderUtil(_logger) {
        this._logger = _logger;
        this.filterQueryMap = new Map();
    }
    DataInputBuilderUtil.prototype.setSelectedPrograms = function (selectedPrograms) {
        this.selectedPrograms = selectedPrograms;
        return this;
    };
    DataInputBuilderUtil.prototype.setSelectedOrgUnit = function (selectedOrgUnit) {
        this.selectedOrgUnit = selectedOrgUnit;
        return this;
    };
    DataInputBuilderUtil.prototype.setSelectedStartDate = function (selectedStartDate) {
        this.startDate = selectedStartDate;
        return this;
    };
    DataInputBuilderUtil.prototype.setSelectedEndDate = function (selectedEndDate) {
        this.endDate = selectedEndDate;
        return this;
    };
    DataInputBuilderUtil.prototype.setFilterQueryMap = function (filterQueryMap) {
        this.filterQueryMap = filterQueryMap;
        return this;
    };
    /*
     * Filters must be merged as the programFilterComponents are not aware of each others existence.
     */
    DataInputBuilderUtil.prototype.mergeFilterQueries = function (filterQueryMap) {
        var _this = this;
        var iterator = filterQueryMap.keys();
        filterQueryMap.forEach(function (filterQueries) {
            var key = iterator.next().value;
            filterQueries.forEach(function (filter) {
                switch (filter.getFilterOperation()) {
                    case FilterOperation_enum_1.FilterOperation.ADD:
                        _this.addFilter(filter, key);
                        break;
                    case FilterOperation_enum_1.FilterOperation.REMOVE:
                        _this.removeFilter(filter, key);
                        break;
                }
            });
        });
        return this;
    };
    /*
     * Helper methods to 'mergeFilterQueries' function
     */
    DataInputBuilderUtil.prototype.addFilter = function (filter, programId) {
        this._logger.info('Adding:', filter.toString());
        var currentFilterQueries = this.filterQueryMap.get(programId);
        if (currentFilterQueries === undefined || currentFilterQueries === null)
            currentFilterQueries = [];
        this.setFilterQueryMap(this.filterQueryMap.set(programId, currentFilterQueries.concat([filter])));
    };
    DataInputBuilderUtil.prototype.removeFilter = function (filter, programId) {
        this._logger.info('Removing:', filter.toString());
        var currentFilterQueries = this.filterQueryMap.get(programId);
        if (currentFilterQueries === undefined || currentFilterQueries === null)
            return;
        var updatedFilterQueryList = [];
        for (var i = 0; i < currentFilterQueries.length; i++) {
            if (currentFilterQueries[i].toString() !== filter.toString())
                updatedFilterQueryList.push(currentFilterQueries[i]);
        }
        this.setFilterQueryMap(this.filterQueryMap.set(programId, updatedFilterQueryList));
        this._logger.info('Query List after removing:', this.filterQueryMap);
    };
    DataInputBuilderUtil.prototype.validateInputObject = function () {
        var errorMessages = [];
        if (this.selectedOrgUnit === null || this.selectedOrgUnit === undefined)
            errorMessages.push('Selected organisation unit not set');
        if (this.startDate === null || this.startDate === undefined)
            errorMessages.push('Start date not set');
        if (this.endDate === null || this.endDate === undefined)
            errorMessages.push('End date not set');
        if (this.selectedPrograms === null || this.selectedPrograms === undefined ||
            this.selectedPrograms.length === 0 || this.selectedPrograms[0] === null ||
            this.selectedPrograms[0] === undefined)
            errorMessages.push('Program not set');
        return errorMessages;
    };
    DataInputBuilderUtil.prototype.createDataInputObject = function () {
        var newColor = MapObjectFactory_util_1.MapObjectFactory.getNewColor();
        if (newColor === null)
            return null;
        var datasetId = DataInputBuilderUtil.datasetId++;
        var programsClone = this.selectedPrograms.concat([]);
        var orgUnitClone = __assign({}, this.selectedOrgUnit);
        var startDateClone = this.startDate + '';
        var endDateClone = this.endDate + '';
        var filterQueryMapClone = new Map();
        this.filterQueryMap.forEach(function (filterQueries, key) {
            var filterQueryClones = [];
            filterQueries.forEach(function (filterQuery) {
                filterQueryClones.push(filterQuery.clone());
            });
            filterQueryMapClone.set('' + key, filterQueryClones);
        });
        return new Dataset_model_1.Dataset(datasetId, newColor, programsClone, orgUnitClone, startDateClone, endDateClone, filterQueryMapClone);
    };
    DataInputBuilderUtil.resetDatasetId = function () {
        DataInputBuilderUtil.datasetId = 0;
    };
    return DataInputBuilderUtil;
}());
DataInputBuilderUtil.datasetId = 0;
exports.DataInputBuilderUtil = DataInputBuilderUtil;
//# sourceMappingURL=DataInputBuilder.util.js.map