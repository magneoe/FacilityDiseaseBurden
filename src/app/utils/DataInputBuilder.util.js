"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InputDataObject_model_1 = require("../models/InputDataObject.model");
var FilterOperation_enum_1 = require("../enums/FilterOperation.enum");
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
    DataInputBuilderUtil.prototype.createDataInputObject = function () {
        return new InputDataObject_model_1.InputDataObject(this.selectedPrograms, this.selectedOrgUnit, this.startDate, this.endDate, this.filterQueryMap);
    };
    return DataInputBuilderUtil;
}());
exports.DataInputBuilderUtil = DataInputBuilderUtil;
//# sourceMappingURL=DataInputBuilder.util.js.map