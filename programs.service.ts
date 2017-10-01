import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { OrganizationUnit } from '../orgLoader/OrganizationUnit';

@Injectable()
export class ProgramsService {

  private options = new RequestOptions({
    method: 'GET',
    headers: new Headers()
  });

  constructor(private _http: Http) {}

  getPrograms(query: string, user: any): Observable<OrganizationUnit[]> {
    this.options.headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + user.password));

    return this._http.get(user.connectionLink + '/' + query, this.options)
                     .map((response: Response) => <OrganizationUnit[]> response.json())
                     .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error());
  }
}