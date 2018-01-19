import {Program} from "./Program.model";
import {OrganizationUnit} from "./OrganizationUnit.model";
import {FilterQuery} from "./FilterQuery.model";
import {TrackedEntity} from "./TrackedEntity.model";
import {Observable} from "rxjs/Observable";

export class Dataset {

    private trackedEntitiyQueries: Map<OrganizationUnit, Observable<TrackedEntity[]>> = new Map<OrganizationUnit, Observable<TrackedEntity[]>>();
    private trackedEntitiyResults: Map<OrganizationUnit, TrackedEntity[]> = new Map<OrganizationUnit, TrackedEntity[]>();
    private entitiesInTotal: number = 0;
    private addHistoricEnrollments:boolean;

    constructor(private datasetId: number,
                private color: string,
                private selectedPrograms: Program[],
                private selectedOrgUnit: OrganizationUnit,
                private startDate: string,
                private endDate: string,
                private filterQueryMap: Map<string, FilterQuery[]>) {
    }

    public getEntitiesInTotal(): number {
        return this.entitiesInTotal;
    }
    public setEntitiesInTotal(total:number){
        this.entitiesInTotal = total;
    }
    public addTrackedEntityQuery(subOrgUnit: OrganizationUnit, trackedEntityObservables: Observable<TrackedEntity[]>): void {
        this.trackedEntitiyQueries.set(subOrgUnit, trackedEntityObservables);
    }

    public getTrackedEntityQueryMap(): Map<OrganizationUnit, Observable<TrackedEntity[]>> {
        return this.trackedEntitiyQueries;
    }

    public addTrackedEntityResults(orgUnit: OrganizationUnit, trackedEntities: TrackedEntity[]): void {
        this.trackedEntitiyResults.set(orgUnit, trackedEntities);
    }

    public getTrackedEntityResults(): Map<OrganizationUnit, TrackedEntity[]> {
        return this.trackedEntitiyResults;
    }

    public getSelectedPrograms(): Program[] {
        return this.selectedPrograms;
    }

    public getSelectedOrgUnit(): OrganizationUnit {
        return this.selectedOrgUnit;
    }

    public getStartDate(): string {
        return this.startDate;
    }

    public getEndDate(): string {
        return this.endDate;
    }

    public getFilterQueryMap(): Map<string, FilterQuery[]> {
        return this.filterQueryMap;
    }

    public getDatasetId(): number {
        return this.datasetId;
    }

    public getColor(): string {
        return this.color;
    }

    public setSelectedPrograms(selectedPrograms: Program[]): void {
        this.selectedPrograms = selectedPrograms;
    }

    public setSelectedOrgUnit(selectedOrgUnit: OrganizationUnit): void {
        this.selectedOrgUnit = selectedOrgUnit;
    }

    public setStartDate(selectedStartDate: string): void {
        this.startDate = selectedStartDate;
    }

    public setEndDate(selectedEndDate: string): void {
        this.endDate = selectedEndDate;
    }

    public setFilterQueriesMap(filterQueries: Map<string, FilterQuery[]>) {
        this.filterQueryMap = filterQueries;
    }
    public setAddHistoricEnrollments(addHistoricEnrollments:boolean):void {
        this.addHistoricEnrollments = addHistoricEnrollments;
    }
    public getAddHistoricEnrollments():boolean {
        return this.addHistoricEnrollments;
    }

    public equals(dataset: Dataset): boolean {
        if (dataset.getDatasetId() !== this.datasetId)
            return false;
        return true;
    }
}

