"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OperatorType_enum_1 = require("../enums/OperatorType.enum");
var FilterQuery = (function () {
    function FilterQuery(trackedEntityAttributes, operator, value, filterOperation) {
        this.trackedEntityAttributes = trackedEntityAttributes;
        this.operator = operator;
        this.value = value;
        this.filterOperation = filterOperation;
    }
    FilterQuery.prototype.getTrackedEntityAttributes = function () {
        return this.trackedEntityAttributes;
    };
    FilterQuery.prototype.getOperator = function () {
        return this.operator;
    };
    FilterQuery.prototype.getValue = function () {
        return this.value;
    };
    FilterQuery.prototype.getFilterOperation = function () {
        return this.filterOperation;
    };
    FilterQuery.prototype.setFilterOperation = function (filterOperation) {
        this.filterOperation = filterOperation;
    };
    FilterQuery.prototype.convertToFormattedQuery = function () {
        var output = '';
        //self validation
        if (this.getTrackedEntityAttributes() === undefined || this.getValue() === undefined || this.getOperator() === undefined)
            return output;
        output += (this.getTrackedEntityAttributes() === null ? '' : this.getTrackedEntityAttributes().attribute) + ':';
        switch (this.getOperator()) {
            case OperatorType_enum_1.OperatorType.GREATER_THAN:
                output += 'ge:';
                break;
            case OperatorType_enum_1.OperatorType.LESS_THAN:
                output += 'le:';
                break;
            case OperatorType_enum_1.OperatorType.EQUALS:
                output += 'eq:';
                break;
            case OperatorType_enum_1.OperatorType.LIKE:
                output += 'like:';
                break;
        }
        output += this.getValue();
        return output;
    };
    FilterQuery.prototype.toString = function () {
        return this.convertToFormattedQuery();
    };
    FilterQuery.prototype.getDisplayString = function () {
        var output = '' + this.getTrackedEntityAttributes().displayName;
        switch (this.getOperator()) {
            case OperatorType_enum_1.OperatorType.GREATER_THAN:
                output += ' >= ';
                break;
            case OperatorType_enum_1.OperatorType.LESS_THAN:
                output += ' <= ';
                break;
            case OperatorType_enum_1.OperatorType.EQUALS:
                output += ' equals ';
                break;
            case OperatorType_enum_1.OperatorType.LIKE:
                output += ' like ';
                break;
        }
        output += '"' + this.getValue() + '"';
        return output;
    };
    return FilterQuery;
}());
exports.FilterQuery = FilterQuery;
//# sourceMappingURL=FilterQuery.model.js.map