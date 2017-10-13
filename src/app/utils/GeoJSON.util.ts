export class GeoJSONUtil {

  public static exportToGeo(coordinates:string): any {
    if(coordinates == null || coordinates == undefined)
      return null;
    coordinates = coordinates.trim();

    coordinates = coordinates.replace(/[^a-zA-Z0-9|,|.]+/g,"");
    console.log('Coords new:', coordinates);

    var lat = coordinates.split(',', 2)[0];
    var lon = coordinates.split(',', 2)[1];

    console.log('Lat:', lat);
    console.log('Lon:', lon);
    if (lat == null || lat == undefined || lon == null || lon == undefined)
      return null;
    else {
      let geoJSONFeature = {
        "type": "Feature",
        "properties": {
          "popupContent": "test"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [lat, lon]
        }
      };
      return geoJSONFeature;
    }
  }
}
