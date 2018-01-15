"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GeoJSONUtil = (function () {
    function GeoJSONUtil() {
    }
    GeoJSONUtil.exportPointToGeo = function (coordinates, popupContent) {
        var lat = this.getLat(coordinates);
        var lng = this.getLng(coordinates);
        if (lat === null || lng === null || lat === undefined || lng === undefined)
            return null;
        else {
            var geoJSONFeature = {
                "type": "Feature",
                "properties": {
                    "popupContent": popupContent
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [lat, lng]
                }
            };
            return geoJSONFeature;
        }
    };
    GeoJSONUtil.exportPolyLineToGeo = function (coordinates) {
        var _this = this;
        var coordList = [];
        if (coordinates.length !== 2 || coordinates[0] === null || coordinates[1] === null) {
            console.log('Invalid coordinates:', coordinates);
            return null;
        }
        coordinates.forEach(function (coordinate) {
            var lat = parseFloat(_this.getLat(coordinate));
            var lng = parseFloat(_this.getLng(coordinate));
            if (lat === null || lng === null || lat === undefined || lng === undefined) {
                console.log('Invalid coordinates:', lat);
                console.log('Invalid coordinates:', lng);
                return null;
            }
            coordList.push([lat, lng]);
        });
        var geoJSONFeature = {
            "type": "LineString",
            "coordinates": coordList,
        };
        return geoJSONFeature;
    };
    GeoJSONUtil.getLat = function (coordinates) {
        if (coordinates === null || coordinates === undefined)
            return null;
        coordinates = coordinates.trim();
        return coordinates.split(',')[0];
    };
    GeoJSONUtil.getLng = function (coordinates) {
        if (coordinates === null || coordinates === undefined)
            return null;
        coordinates = coordinates.trim();
        return coordinates.split(',')[1];
    };
    return GeoJSONUtil;
}());
exports.GeoJSONUtil = GeoJSONUtil;
//# sourceMappingURL=GeoJSON.util.js.map