
export interface OrganizationUnit {
  id: string,
  displayName: string,
  children: OrganizationUnit[],
  selected: boolean,
  level: number
}
