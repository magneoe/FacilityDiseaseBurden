import { Programs } from '../programs/Programs';

export interface OrganizationUnit {
    id: string,
    displayName: string,
    children: OrganizationUnit[],
    selected: boolean,
    level: number,
    programs: Programs[]
}