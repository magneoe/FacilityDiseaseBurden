import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {OrganizationUnit} from "../models/OrganizationUnit";
import {Programs} from "../models/Programs";
import {HttpWrapperService} from "./HttpWrapper.service";

/*
 * This service supports the programs component.
 * Increased reuse of code - stateless service
 */

@Injectable()
export class ProgramsService extends HttpWrapperService<OrganizationUnit>{

  constructor(_http: Http) {
    super(_http, JSON.parse(sessionStorage.getItem("user")));
  }

  loadPrograms(query: string): Observable<OrganizationUnit[]> {
    return this.get(query).do(data => console.log(JSON.stringify(data))).catch(this.handleError);
  }
  /*
   * Implements the HttpWrapper service methods
   */
  getAsArray(res: Response):OrganizationUnit[]{
    return <OrganizationUnit[]> res.json();
  }
  handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error());
  }


  setSelectedProgram(event:any, programs:Programs[]): Programs[] {
    if(event == null || event === undefined)
      return programs;

    for (let i = 0; i < programs.length; i++) {
      if (programs[i].id == event.target.value)
        programs[i].isSelected = event.target.checked;
    }
    return programs;
  }

}
