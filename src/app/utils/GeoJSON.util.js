"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GeoJSONUtil = (function () {
    function GeoJSONUtil() {
    }
    GeoJSONUtil.exportPointToGeo = function (coordinates, popupContent) {
        var lat = this.getLat(coordinates);
        var lng = this.getLng(coordinates);
        if (lat === null || lng === null)
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
        coordinates.forEach(function (coordinate) {
            var lat = parseFloat(_this.getLat(coordinate));
            var lng = parseFloat(_this.getLng(coordinate));
            coordList.push([lat, lng]);
        });
        if (coordList.length < 2 || coordList[0].length < 2 || coordList[1].length < 2)
            return null;
        else {
            console.log('Exporting to poly line coords:', coordList);
            var geoJSONFeature = {
                "type": "LineString",
                "coordinates": coordList,
            };
            return geoJSONFeature;
        }
    };
    GeoJSONUtil.getLat = function (coordinates) {
        if (coordinates === null || coordinates === undefined || (coordinates.split('[').length - 1) > 2)
            return null;
        coordinates = coordinates.trim();
        if (coordinates.startsWith('['))
            coordinates = coordinates.slice(1, coordinates.length - 1);
        return coordinates.split(',')[0];
    };
    GeoJSONUtil.getLng = function (coordinates) {
        if (coordinates === null || coordinates === undefined || (coordinates.split('[').length - 1) > 2)
            return null;
        coordinates = coordinates.trim();
        if (coordinates.startsWith('['))
            coordinates = coordinates.slice(1, coordinates.length - 1);
        return coordinates.split(',')[1];
    };
    return GeoJSONUtil;
}());
exports.GeoJSONUtil = GeoJSONUtil;
//# sourceMappingURL=GeoJSON.util.js.map