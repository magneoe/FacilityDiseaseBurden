"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TrackedEntity = (function () {
    function TrackedEntity(attributes, enrollments) {
        this.setAttributes(attributes);
        this.enrollments = enrollments;
    }
    /*
     * GETTERS AND SETTERS
     */
    TrackedEntity.prototype.getEnrollments = function () {
        return this.enrollments;
    };
    TrackedEntity.prototype.setAttributes = function (attributes) {
        this.attributes = attributes;
    };
    TrackedEntity.prototype.toString = function () {
        var output = new Array();
        this.attributes.forEach(function (attribute) {
            output.push("<strong>" + attribute.displayName.charAt(0).toUpperCase() + attribute.displayName.slice(1) + "</strong>: " + attribute.value);
        });
        output = output.sort(function (a, b) {
            if (a < b)
                return -1;
            if (a > b)
                return 1;
            return 0;
        });
        return output.join("<br/>");
    };
    TrackedEntity.prototype.getCoords = function () {
        var coords = "";
        if (this.attributes !== undefined) {
            this.attributes.forEach(function (attribute) {
                if (attribute.valueType === "COORDINATE") {
                    coords = attribute.value;
                }
            });
        }
        return coords;
    };
    return TrackedEntity;
}());
exports.TrackedEntity = TrackedEntity;
//# sourceMappingURL=TrackedEntity.model.js.map