import {Component, EventEmitter, Output} from '@angular/core';
import {OrganizationUnitLoaderService} from "../../services/organizationUnitLoader.service";
import {OrderByDisplayNamePipe} from "../../pipes/organizationLoader.pipe";
import {ValidationComponent} from "../ValidationComponent";
import {OrganizationUnit} from "../../models/OrganizationUnit";


@Component({
  selector: 'organisationPicker',
  templateUrl: 'app/views/organizationLoader.component.html',
  providers: [OrganizationUnitLoaderService, OrderByDisplayNamePipe]
})


export class OrganizationLoaderComponent extends ValidationComponent{
  organizationUnits: OrganizationUnit[];
  private query:string;
  private levels: number[] = [1];
  isLoading:boolean = false;
  private selectedOrgUnit: OrganizationUnit;

  @Output() validationUpdateEvent = new EventEmitter();

  constructor(private _orgLoaderService: OrganizationUnitLoaderService) {
    super();
  }

  notifyValueChange(event:any):void {
    console.log('Notify changes!');
    this.validationUpdateEvent.emit('Message here');
  }
  ngOnInit(): void {
    this.isLoading = true;
    this._orgLoaderService.getOrgUnits('api/organisationUnits?level=1&paging=0&fields=id,displayName,level', JSON.parse(sessionStorage.getItem("user")))
      .subscribe((units:any) => {
        this.organizationUnits = units.organisationUnits});
    this.isLoading = false;
  }

  loadLevel(ancestorId : string, lvl : number) : void {
    this.isLoading = true;
    this.selectedOrgUnit = this._orgLoaderService.findSelectedOrgUnit(ancestorId, this.organizationUnits);
    this.levels = this._orgLoaderService.setLevel(this.selectedOrgUnit, lvl, this.levels, this.organizationUnits);

    if(this.selectedOrgUnit != null) {
      this.query = 'api/organisationUnits?filter=id:eq:' + ancestorId + '&fields=children[id,displayName,level]&paging=0';
      this._orgLoaderService.getOrgUnits(this.query, JSON.parse(sessionStorage.getItem("user")))
        .subscribe((units: any) => {
          this.selectedOrgUnit.children = units.organisationUnits[0].children;
          if (this.selectedOrgUnit.children.length > 0)
            this.levels.push(this.levels.length + 1);
        });
    }
    else if(lvl > 1) {
      this.selectedOrgUnit = this._orgLoaderService.findSelectOrgUnit(lvl-1, this.levels.length, this.organizationUnits);
    }
    this.isLoading = false;
    this.notifyValueChange(null);
  }

  findChildrenOfSelectedOrgUnit(lvl:number): OrganizationUnit[]{
    return this._orgLoaderService.findChildrenOfSelectedOrgUnit(lvl, this.levels.length, this.organizationUnits);
  }

  isValid():Array<string> {
    let errorMessages = new Array();
    if(this.selectedOrgUnit == null) {
      errorMessages.push("OrgUnit not set");
      console.log('errors:', errorMessages);
    }
    return errorMessages;
  }
}
