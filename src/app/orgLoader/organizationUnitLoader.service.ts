import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {OrganizationUnit} from './OrganizationUnit';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Injectable} from '@angular/core';

@Injectable()
export class OrganizationUnitLoaderService {
  private options = new RequestOptions({
    method: 'GET',
    headers: new Headers()
  });


  constructor(private _http: Http) {}

  getOrgUnits(query: string, user: any): Observable<OrganizationUnit[]> {
    this.options.headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + user.password));

    return this._http.get(user.connectionLink + '/' + query, this.options).map((response: Response) => <OrganizationUnit[]> response.json()).
    do(data => console.log(JSON.stringify(data))).catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error());
  }
}
