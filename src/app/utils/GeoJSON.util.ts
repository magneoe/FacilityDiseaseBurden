
export class GeoJSONUtil {

  public static exportPointToGeo(coordinates:string, popupContent:string): any {
    let lat = this.getLat(coordinates);
    let lng = this.getLng(coordinates);
    console.log('Lat:', lat);
    console.log('Lon:', lng);

    if (lat == null || lat == undefined || lng == null || lng == undefined)
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
  public static exportPolyLineToGeo(coordinates:string[]): any {
    let coordList = Array<any[]>();
    coordinates.forEach(coordinate => {
      let lat = this.getLat(coordinate);
      let lng = this.getLng(coordinate);
      if (lat != null && lat != undefined && lng != null && lng != undefined)
        coordList.push([lat,lng]);
    });

    if (coordList.length < 2)
      return null;
    else {
      let geoJSONFeature = {
        "type": "LineString",
        "coordinates": coordList
      };
      return geoJSONFeature;
    }
  }
  private static getLat(coordinates:string):string{
    if(coordinates == null || coordinates == undefined)
      return null;
    coordinates = coordinates.trim();
    coordinates = coordinates.replace(/[^a-zA-Z0-9|,|.]+/g,"");
    return coordinates.split(',', 2)[0];
  }
  private static getLng(coordinates:string):string{
    if(coordinates == null || coordinates == undefined)
      return null;
    coordinates = coordinates.trim();
    coordinates = coordinates.replace(/[^a-zA-Z0-9|,|.]+/g,"");
    return coordinates.split(',', 2)[1];
  }
}
