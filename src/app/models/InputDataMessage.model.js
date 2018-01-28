"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InputDataMessage = (function () {
    function InputDataMessage(broadCastGroup, dataContent, payLoad, reciever) {
        this.broadCastGroup = broadCastGroup;
        this.dataContent = dataContent;
        this.payLoad = payLoad;
        this.reciever = reciever;
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
    InputDataMessage.prototype.getReciever = function () {
        return this.reciever;
    };
    return InputDataMessage;
}());
exports.InputDataMessage = InputDataMessage;
//# sourceMappingURL=InputDataMessage.model.js.map