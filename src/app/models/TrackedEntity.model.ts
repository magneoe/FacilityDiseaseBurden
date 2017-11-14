import {TrackedEntityAttribute} from "./TrackedEntityAttribute.model";

export class TrackedEntity {
  attributes:TrackedEntityAttribute[];
  lastUpdated:Date;

  constructor(attributes:TrackedEntityAttribute[], lastUpdated:Date){
    this.setAttributes(attributes);
    this.lastUpdated = lastUpdated;
  }
  /*
   * GETTERS AND SETTERS
   */
  public getLastUpdated():Date {
    return this.lastUpdated;
  }

  private setAttributes(attributes:TrackedEntityAttribute[]){
    this.attributes = attributes;
  }

  public toString(): string {
    let output = new Array<string>();
    this.attributes.forEach((attribute:TrackedEntityAttribute) => {
      output.push("<strong>" + attribute.displayName.charAt(0).toUpperCase() + attribute.displayName.slice(1) +  "</strong>: " + attribute.value);
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
    let coords:string = "";
    if(this.attributes !== undefined) {
      this.attributes.forEach((attribute: TrackedEntityAttribute) => {
        if (attribute.valueType === "COORDINATE") {
          coords = attribute.value;
        }
      });
    }
    return coords;
  }
}


