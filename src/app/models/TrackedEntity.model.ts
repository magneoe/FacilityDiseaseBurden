import {TrackedEntityAttribute} from "./TrackedEntityAttribute.model";
import {Enrollment} from "./Enrollment.model";

export class TrackedEntity {
  attributes:TrackedEntityAttribute[];
  enrollments:Enrollment[];
  convertedCoords:any;

  constructor(attributes:TrackedEntityAttribute[], enrollments:Enrollment[]){
    this.setAttributes(attributes);
    this.enrollments = enrollments;
  }
  /*
   * GETTERS AND SETTERS
   */
  public getEnrollments():Enrollment[] {
    return this.enrollments;
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


