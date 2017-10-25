
import {Programs} from "./Program.model.";

export interface OrganizationUnit {

  id: string,
  displayName: string,
  children: OrganizationUnit[],
  selected: boolean,
  level: number,
  coordinates:string,
  programs: Programs[],
/*
  constructor(){

    this.setId(id);
    this.setDisplayName(displayName);
    this.setChildren(children);
    this.setSelected(selected);
    this.setLevel(level);
    this.setCoordinates(coordinates);
    this.setPrograms(programs);

  }

  private setPrograms(programs: Programs[]) {
    this.programs = programs;
  }
  private setCoordinates(coordinates: string) {
    this.coordinates = coordinates;
  }
  private setLevel(level: number) {
    this.level = level;
  }
  private setSelected(selected: boolean) {
    this.selected = selected;
  }
  private setChildren(children: OrganizationUnit[]) {
    this.children = children;
  }


  private setDisplayName(displayName: string) {
    this.displayName = displayName;
  }

  private setId(id: string) {
    this.id = id;
  }
*/
}

