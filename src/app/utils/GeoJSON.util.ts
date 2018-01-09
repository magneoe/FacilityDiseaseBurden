export class GeoJSONUtil {

    public static exportPointToGeo(coordinates: string, popupContent: string): any {
        let lat = this.getLat(coordinates);
        let lng = this.getLng(coordinates);

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

    public static exportPolyLineToGeo(coordinates: string[]): any {
        let coordList: number[][] = [];
        if (coordinates.length !== 2 || coordinates[0] === null || coordinates[1] === null) {
            console.log('Invalid coordinates:', coordinates);
            return null;
        }

        coordinates.forEach(coordinate => {
            let lat: number = parseFloat(this.getLat(coordinate));
            let lng: number = parseFloat(this.getLng(coordinate));
            if (lat === null || lng === null || lat === undefined || lng === undefined) {
                console.log('Invalid coordinates:', lat);
                console.log('Invalid coordinates:', lng);
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

    private static getLat(coordinates: string): string {
        if (coordinates === null || coordinates === undefined) //We do not support polygons, if more than one coordinate occurs, we assume its a polygon
            return null;
        coordinates = coordinates.trim();
        return coordinates.split(',')[0];
    }

    private static getLng(coordinates: string): string {
        if (coordinates === null || coordinates === undefined)  //We do not support polygons, if more than one coordinate occurs, we assume its a polygon
            return null;
        coordinates = coordinates.trim();
        return coordinates.split(',')[1];
    }
}
