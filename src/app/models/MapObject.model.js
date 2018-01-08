"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MapObject = (function () {
    function MapObject(icon) {
        this.setIcon(icon);
    }
    MapObject.prototype.getIcon = function () {
        return this.icon;
    };
    MapObject.prototype.setIcon = function (icon) {
        this.icon = icon;
    };
    MapObject.prototype.setIconShadowUrl = function (shadowUrl) {
        this.icon.shadowUrl = shadowUrl;
    };
    MapObject.prototype.setIconAttributes = function (attributes) {
        this.icon = new this.icon(attributes);
    };
    return MapObject;
}());
exports.MapObject = MapObject;
//# sourceMappingURL=MapObject.model.js.map