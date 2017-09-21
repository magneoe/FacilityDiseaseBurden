import {Component} from '@angular/core';
import {OrganizationUnitLoaderService} from './organizationUnitLoader.service';
import {OrganizationUnit} from "./OrganizationUnit";
import {OrderByDisplayNamePipe} from "./organizationLoader.pipe";


@Component({
  selector: 'facilityBurden-app',
  templateUrl: 'app/orgLoader/organizationLoader.component.html',
  providers: [OrganizationUnitLoaderService, OrderByDisplayNamePipe]
})


export class OrganizationLoaderComponent {
  organizationUnits: OrganizationUnit[];
  private query:string;
  private levels: number[] = [1];
  private selectedOrgUnit:OrganizationUnit;
  private message:string = "";
  isLoading:boolean = false;

  constructor(private _orgLoaderService: OrganizationUnitLoaderService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this._orgLoaderService.getOrgUnits('api/organisationUnits?level=1&paging=0&fields=id,displayName,level', JSON.parse(sessionStorage.getItem("user")))
      .subscribe((units:any) => {
        this.organizationUnits = units.organisationUnits});
    this.isLoading = false;
  }

  loadLevel(ancestorId : string, lvl : number) : void {
    if(ancestorId == "default" || ancestorId == null)
      return;
    this.isLoading = true;

    var selectedOrgUnit = this.findSelectedOrgUnit(ancestorId);
    this.selectedOrgUnit = selectedOrgUnit;
    this.setLevel(selectedOrgUnit, lvl);


    this.query = 'api/organisationUnits?filter=id:eq:' + ancestorId +'&fields=children[id,displayName,level]&paging=0';
    this._orgLoaderService.getOrgUnits(this.query, JSON.parse(sessionStorage.getItem("user")))
      .subscribe((units:any) => {
        selectedOrgUnit.children = units.organisationUnits[0].children;
        if(selectedOrgUnit.children.length > 0)
          this.levels.push(this.levels.length+1);
      });

    this.message = "";
    this.isLoading = false;
  }

  findSelectedOrgUnit(ancestorId: string) : OrganizationUnit {
    var orgUnitsAtGivenLevel = this.organizationUnits;
    var org : OrganizationUnit;
    do {
      if((org = orgUnitsAtGivenLevel.find(org => org.id === ancestorId)) != null)
      {
          return org;
      }
    }while ((orgUnitsAtGivenLevel = orgUnitsAtGivenLevel.find(org => org.selected === true).children) != null);
  }

  findSelectedOrgUnitsAtLevel(level: number) : OrganizationUnit[] {
    var orgUnitsAtGivenLevel = this.organizationUnits;

    for(var i = 0; i < this.levels.length; i++){
      if(i+1 == level){
        return orgUnitsAtGivenLevel;
      }
      orgUnitsAtGivenLevel = orgUnitsAtGivenLevel.find(org => org.selected === true).children;
    }
  }

  setLevel(selectedOrgUnit : OrganizationUnit, level : number) : void {
    var orgUnitsAtLevel = this.findSelectedOrgUnitsAtLevel(level);

    orgUnitsAtLevel.map(org => org.selected = false);
    orgUnitsAtLevel.map(org => org.children = []);
    selectedOrgUnit.selected = true;

    if(this.levels.length > level)
      this.levels = this.levels.slice(0, level);
  }

  selectOrgUnit():void {
    this.message = 'Selected orgOrg name: ' + this.selectedOrgUnit.displayName;
  }
}
