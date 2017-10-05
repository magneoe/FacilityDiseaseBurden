
import {Programs} from "./Programs";

export interface OrganizationUnit {
  id: string,
  displayName: string,
  children: OrganizationUnit[],
  selected: boolean,
  level: number,
  programs: Programs[]
}
