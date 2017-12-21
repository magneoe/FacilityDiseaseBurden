
export class GeoJSONUtil {

  public static exportPointToGeo(coordinates: string, popupContent: string): any {
    let lat = this.getLat(coordinates);
    let lng = this.getLng(coordinates);
    console.log('Coorinates in export Point to geo:', coordinates);
    if (lat === null || lat === undefined || lng === null || lng === undefined)
      return null;
    else {
      console.log('Export point:', [lat, lng]);
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
    console.log('Coords:', coordinates);
    let coordList:number[][] = [];
    coordinates.forEach(coordinate => {
      let lat:number = parseFloat(this.getLat(coordinate));
      let lng:number = parseFloat(this.getLng(coordinate));
      coordList.push([lat, lng]);
    });

    if (coordList.length < 2)
      return null;
    else {
      console.log('Exporting to poly line coords:', coordList);
      let geoJSONFeature = {
        "type": "LineString",
        "coordinates": coordList,
      };
      return geoJSONFeature;
    }
  }
  private static getLat(coordinates: string): string {
    if(coordinates === null || coordinates === undefined)
      return null;
    coordinates = coordinates.trim();
    if(coordinates.startsWith('['))
      coordinates = coordinates.slice(1, coordinates.length-1);
    return coordinates.split(',')[0];
  }
  private static getLng(coordinates:string):string {
    if(coordinates === null || coordinates === undefined)
      return null;
    coordinates = coordinates.trim();
    if(coordinates.startsWith('['))
        coordinates = coordinates.slice(1, coordinates.length-1);
    return coordinates.split(',')[1];
  }
}
