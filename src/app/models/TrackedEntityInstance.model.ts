export class TrackedEntityInstanceModel {

  private values:Map<string,any>;

  constructor(attributes:any[], private lastUpdated:Date){
    this.values = new Map<string, any>();
    this.setAttributes(attributes);
  }
  /*
   * GETTERS AND SETTERS
   */
  public getLastUpdated():Date {
    return this.lastUpdated;
  }


  private setAttributes(attributes:any[]){
    attributes.forEach(row => {
      this.values.set(row.displayName, row);
    });
  }
/*
  public exportToGeoJSON(coords:string):any {
    var lat = coords.split(',',2)[0];
    var lon = coords.split(',',2)[1];

    if(lat == null || lat == undefined || lon == null || lon == undefined)
      return null;
    else {
      let geoJSONFeature = {
        "type": "Feature",
        "properties": {
          "popupContent": ""
        },
        "geometry": {
          "type": "Point",
          "coordinates": [lat, lon]
        }
      };
      return geoJSONFeature;
    }
  }*/

  public toString(): string {
    let output = "";
    this.values.forEach(value => {
      output += value.displayName + ": " + value.value + "\n";
    });
    return output;
  }

  public getCoords():string {
    let coords:string = ""
    this.values.forEach(value => {
      if(value.valueType === "COORDINATE"){
        coords = value.value;
      }
    });
    return coords;
  }
}


