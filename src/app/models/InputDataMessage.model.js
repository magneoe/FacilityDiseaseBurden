"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InputDataMessage = (function () {
    function InputDataMessage(broadCastGroup, dataContent, payLoad) {
        this.broadCastGroup = broadCastGroup;
        this.dataContent = dataContent;
        this.payLoad = payLoad;
    }
    InputDataMessage.prototype.getBroadCaseGroup = function () {
        return this.broadCastGroup;
    };
    InputDataMessage.prototype.getDataContent = function () {
        return this.dataContent;
    };
    InputDataMessage.prototype.getPayload = function () {
        return this.payLoad;
    };
    return InputDataMessage;
}());
exports.InputDataMessage = InputDataMessage;
//# sourceMappingURL=InputDataMessage.model.js.map