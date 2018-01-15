import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {OrganizationUnit} from "../../models/OrganizationUnit.model";
import {Program} from "../../models/Program.model";
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
    return this.get(query).do(data => JSON.stringify(data)).catch(this.handleError);
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
}
