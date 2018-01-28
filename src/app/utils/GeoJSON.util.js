"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GeoJSONUtil = (function () {
    function GeoJSONUtil() {
    }
    GeoJSONUtil.exportPointToGeo = function (coordinates, popupContent) {
        try {
            var lat = coordinates.lat;
            var lng = coordinates.lng;
            console.log('Lat ln export point:' + lat, lng);
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
        }
        catch (error) {
            console.log(error);
        }
        return null;
    };
    GeoJSONUtil.exportPolyLineToGeo = function (coordinates) {
        console.log('Lat ln export geo line:', coordinates);
        try {
            var coordList_1 = [];
            coordinates.forEach(function (coordinate) {
                var lat = coordinate.lat;
                var lng = coordinate.lng;
                if (lat === null || lng === null || lat === undefined || lng === undefined) {
                    return null;
                }
                coordList_1.push([lat, lng]);
            });
            var geoJSONFeature = {
                "type": "LineString",
                "coordinates": coordList_1,
            };
            return geoJSONFeature;
        }
        catch (error) {
            console.log(error);
        }
        return null;
    };
    GeoJSONUtil.convertCoordinates = function (coordinateString, L) {
        console.log('Converting coords:', coordinateString);
        var lngLatObj = null;
        if (coordinateString === null || coordinateString === undefined || coordinateString.length === 0 || coordinateString.indexOf(',') === -1)
            return null;
        try {
            //Check if its a polygon - does not support this.
            if ((coordinateString.substring(0, 4).match(/\[/g) || []).length >= 2) {
                console.log('Converting polygon return null');
                return null;
            }
            //Not polygon coordinate #test 1
            if (coordinateString.split('"').length >= 4)
                lngLatObj = L.latLng(parseFloat(coordinateString.split('"')[1]), parseFloat(coordinateString.split('"')[3]));
            else {
                if (coordinateString.startsWith('[') && coordinateString.endsWith(']')) {
                    coordinateString = coordinateString.substring(1, coordinateString.length - 1);
                    console.log('Starts and ends with [ ]', coordinateString);
                }
                lngLatObj = L.latLng(parseFloat(coordinateString.split(',')[0]), parseFloat(coordinateString.split(',')[1]));
            }
        }
        catch (error) {
            console.log(error);
            return null;
        }
        console.log('Return method returns:', lngLatObj);
        return lngLatObj;
    };
    return GeoJSONUtil;
}());
exports.GeoJSONUtil = GeoJSONUtil;
//# sourceMappingURL=GeoJSON.util.js.map