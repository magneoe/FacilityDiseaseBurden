export class TrackedEntity {

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

  public toString(): string {
    let output = new Array<string>();
    this.values.forEach(value => {
      output.push("<strong>" + value.displayName.charAt(0).toUpperCase() + value.displayName.slice(1) +  "</strong>: " + value.value);
    });
    output = output.sort(function (a:string, b:string){
      if(a < b)
        return -1;
      if(a > b)
        return 1;
      return 0;
    });
    return output.join("<br/>");
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


