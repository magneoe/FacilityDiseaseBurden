"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OperatorType_enum_1 = require("../enums/OperatorType.enum");
var FilterQuery = (function () {
    function FilterQuery(property, operator, value, filterOperation) {
        this.property = property;
        this.operator = operator;
        this.value = value;
        this.filterOperation = filterOperation;
    }
    FilterQuery.prototype.getProperty = function () {
        return this.property;
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
        if (this.getProperty() === undefined || this.getValue() === undefined || this.getOperator() === undefined)
            return output;
        output += (this.getProperty() === null ? '' : this.getProperty()) + ':';
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
    return FilterQuery;
}());
exports.FilterQuery = FilterQuery;
//# sourceMappingURL=FilterQuery.model.js.map