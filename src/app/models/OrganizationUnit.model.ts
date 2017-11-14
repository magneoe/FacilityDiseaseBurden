
import {Program} from "./Program.model";

export interface OrganizationUnit {

  id: string,
  displayName: string,
  children: OrganizationUnit[],
  selected: boolean,
  level: number,
  coordinates:string,
  programs: Program[],

}

