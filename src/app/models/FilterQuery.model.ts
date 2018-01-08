import {FilterOperation} from "../enums/FilterOperation.enum";
import {OperatorType} from "../enums/OperatorType.enum";
import {TrackedEntityAttribute} from "./TrackedEntityAttribute.model";

export class FilterQuery {
    constructor(private trackedEntityAttributes: TrackedEntityAttribute, private operator: OperatorType,
                private value: string, private filterOperation: FilterOperation) {
    }

    public getTrackedEntityAttributes(): TrackedEntityAttribute {
        return this.trackedEntityAttributes;
    }

    public getOperator(): OperatorType {
        return this.operator;
    }

    public getValue(): string {
        return this.value;
    }

    public getFilterOperation(): FilterOperation {
        return this.filterOperation;
    }

    public setFilterOperation(filterOperation: FilterOperation) {
        this.filterOperation = filterOperation;
    }

    public convertToFormattedQuery(): string {
        let output: string = '';
        //self validation
        if (this.getTrackedEntityAttributes() === undefined || this.getValue() === undefined || this.getOperator() === undefined)
            return output;

        output += (this.getTrackedEntityAttributes() === null ? '' : this.getTrackedEntityAttributes().attribute) + ':';
        switch (this.getOperator()) {
            case OperatorType.GREATER_THAN:
                output += 'ge:';
                break;
            case OperatorType.LESS_THAN :
                output += 'le:';
                break;
            case OperatorType.EQUALS:
                output += 'eq:';
                break;
            case OperatorType.LIKE:
                output += 'like:';
                break;
        }
        output += this.getValue();

        return output;
    }

    public toString(): string {
        return this.convertToFormattedQuery();
    }

    public getDisplayString(): string {
        let output:string = '' + this.getTrackedEntityAttributes().displayName;
        switch (this.getOperator()) {
            case OperatorType.GREATER_THAN:
                output += ' >= ';
                break;
            case OperatorType.LESS_THAN :
                output += ' <= ';
                break;
            case OperatorType.EQUALS:
                output += ' equals ';
                break;
            case OperatorType.LIKE:
                output += ' like ';
                break;
        }
        output += '"' + this.getValue() + '"';
        return output;
    }
}




