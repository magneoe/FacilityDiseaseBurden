import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {OrganizationUnit} from '../models/OrganizationUnit';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Injectable} from '@angular/core';
import {HttpWrapperService} from "./HttpWrapper.service";

/*
 * This service supports the organisation loader component -
 * A lot of the supporting methods from the component are placed here,
 * to increase reuse. Also, this service is stateless.
 */
@Injectable()
export class OrganizationUnitLoaderService extends HttpWrapperService<OrganizationUnit> {

  constructor(_http: Http) {
    super(_http, JSON.parse(sessionStorage.getItem("user")));
  }


 getOrgUnits(query:string){
   return this.get(query).do(data => console.log(JSON.stringify(data))).catch(this.handleError);
 }
  /*
    * Implements the HttpWrapper methods
    */
 getAsArray(res: Response):OrganizationUnit[]{
   return <OrganizationUnit[]> res.json();
 }
 handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error());
  }


  findSelectedOrgUnit(ancestorId: string, organisationUnits: OrganizationUnit[]) : OrganizationUnit {

    var orgUnitsAtGivenLevel = organisationUnits;
    var org : OrganizationUnit = null;
    if(ancestorId.startsWith("Choose"))
      return org;
    do {
      if((org = orgUnitsAtGivenLevel.find(org => org.id === ancestorId)) != null) {
        return org;
      }
    }while ((orgUnitsAtGivenLevel = orgUnitsAtGivenLevel.find(org => org.selected === true).children) != null);
  }

  findChildrenOfSelectedOrgUnit(level: number, numberOfLevels: number, organisationUnits: OrganizationUnit[]) : OrganizationUnit[] {
    var orgUnitsAtGivenLevel = organisationUnits;

    for(var i = 0; i < numberOfLevels; i++){
      if(i+1 == level){
        return orgUnitsAtGivenLevel;
      }
      orgUnitsAtGivenLevel = orgUnitsAtGivenLevel.find(org => org.selected === true).children;
    }
  }
  setLevel(selectedOrgUnit : OrganizationUnit, level : number, levels: number[], organisationUnits: OrganizationUnit[]) : number[] {
    var orgUnitsAtLevel = this.findChildrenOfSelectedOrgUnit(level, levels.length, organisationUnits);

    orgUnitsAtLevel.map(org => org.selected = false);
    orgUnitsAtLevel.map(org => org.children = []);
    if(selectedOrgUnit != null)
      selectedOrgUnit.selected = true;

    if(levels.length > level)
      levels = levels.slice(0, level);
    return levels;
  }

  findSelectOrgUnit(lvl:number, numberOfLevels:number, organisationUnits:OrganizationUnit[]): OrganizationUnit {

    var orgUnitsAtGivenLevel = organisationUnits;

    for(var i = 0; i < numberOfLevels; i++){
      if(i+1 == lvl){
        return orgUnitsAtGivenLevel.find(org => org.selected === true);
      }
      orgUnitsAtGivenLevel = orgUnitsAtGivenLevel.find(org => org.selected === true).children;
    }
  }
}
