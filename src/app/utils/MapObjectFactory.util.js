"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MapObject_model_1 = require("../models/MapObject.model");
var MapObjectType_enum_1 = require("../enums/MapObjectType.enum");
/*
 * What: This class has the responsibility of handing out available colors for map objects.
 * Also, it creates map objects (markers/orgUnit markers)
 * Why: To make to code more reuseable.
 */
var MapObjectFactory = (function () {
    function MapObjectFactory() {
    }
    MapObjectFactory.getNextAvailableColor = function (progId) {
        if (MapObjectFactory.programColorMap.has(progId))
            return this.colors[MapObjectFactory.programColorMap.get(progId)].toLowerCase();
        else
            MapObjectFactory.programColorMap.set(progId, this.pointer);
        return this.colors[this.pointer++].toLowerCase();
    };
    MapObjectFactory.getMapObject = function (type, color, L) {
        var mapObject = new MapObject_model_1.MapObject(L.Icon.extend({
            iconSize: [38, 95],
            shadowSize: [50, 64],
            iconAnchor: [22, 94],
            shadowAnchor: [4, 62],
            popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
        }));
        switch (type) {
            case MapObjectType_enum_1.MapObjectType.ENTITY:
                mapObject.setIconShadowUrl('../../assets/img/marker-shadow.png');
                mapObject.setIconAttributes({ iconSize: [25, 41], iconAnchor: [12, 40], iconUrl: './../../assets/images/marker-icon-' + color + '.png' });
                break;
            case MapObjectType_enum_1.MapObjectType.FACILITY:
                mapObject.setIconShadowUrl('../../assets/img/facility-shadow.png');
                mapObject.setIconAttributes({ iconAnchor: [15, 15], iconUrl: './../../assets/images/facility.png' });
                break;
            default:
                break;
        }
        return mapObject;
    };
    MapObjectFactory.reset = function () {
        this.pointer = 0;
        this.programColorMap.clear();
    };
    return MapObjectFactory;
}());
MapObjectFactory.colors = ["RED", "BLUE", "YELLOW", "BROWN", "PURPLE", "GREEN"];
MapObjectFactory.pointer = 0;
MapObjectFactory.programColorMap = new Map();
exports.MapObjectFactory = MapObjectFactory;
//# sourceMappingURL=MapObjectFactory.util.js.map