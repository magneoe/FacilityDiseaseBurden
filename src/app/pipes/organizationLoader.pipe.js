"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var OrderByDisplayNamePipe = (function () {
    /*
     * Orders organisation units by displayName
     */
    function OrderByDisplayNamePipe() {
    }
    OrderByDisplayNamePipe.prototype.transform = function (array, args) {
        if (!array || array === undefined || array.length === 0)
            return null;
        array.sort(function (a, b) {
            if (a.displayName < b.displayName) {
                return -1;
            }
            else if (a.displayName > b.displayName) {
                return 1;
            }
            else {
                return 0;
            }
        });
        return array;
    };
    return OrderByDisplayNamePipe;
}());
OrderByDisplayNamePipe = __decorate([
    core_1.Pipe({
        name: 'orderByDisplayNamePipe'
    })
    /*
     * Orders organisation units by displayName
     */
], OrderByDisplayNamePipe);
exports.OrderByDisplayNamePipe = OrderByDisplayNamePipe;
//# sourceMappingURL=organizationLoader.pipe.js.map