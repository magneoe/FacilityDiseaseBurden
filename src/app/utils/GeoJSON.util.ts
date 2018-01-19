export class GeoJSONUtil {

    public static exportPointToGeo(coordinates: any, popupContent: string): any {
        try {
            let lat = coordinates.lat;
            let lng = coordinates.lng;
            console.log('Lat ln export point:' + lat, lng);
            if (lat === null || lng === null || lat === undefined || lng === undefined)
                return null;
            else {
                let geoJSONFeature = {
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
        catch (error){ console.log(error); }
        return null;
    }

    public static exportPolyLineToGeo(coordinates: any[]): any {
        console.log('Lat ln export geo line:', coordinates);
        try {
            let coordList: number[][] = [];
            coordinates.forEach(coordinate => {
                let lat: number = coordinate.lat;
                let lng: number = coordinate.lng;
                if (lat === null || lng === null || lat === undefined || lng === undefined) {
                    return null;
                }
                coordList.push([lat, lng]);
            });

            let geoJSONFeature = {
                "type": "LineString",
                "coordinates": coordList,
            };
            return geoJSONFeature;
        }
        catch(error){
            console.log(error);
        }
        return null;
    }
    public static convertCoordinates(coordinateString: string, L: any): any {
        console.log('Converting coords:', coordinateString);
        let lngLatObj = null;
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
                lngLatObj = L.latLng(parseFloat(coordinateString.split('"')[1]),
                    parseFloat(coordinateString.split('"')[3]));
            //Not polygon coordinate #test 2
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
    }
}
