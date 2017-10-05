
import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from "rxjs/Observable";

@Injectable()
export abstract class HttpWrapperService<T> {

  private options : RequestOptions;

  constructor(private _http: Http, private user:any) {
    this.options = new RequestOptions();
    this.options.method = 'GET';

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + user.password));
    this.options.headers = headers;
  }

  public get(query:string): Observable<any> {
    return this._http.get(this.user.connectionLink + '/' + query, this.options).map((res:Response) => this.getAsArray(res)).catch(this.handleError);
  }

  abstract getAsArray(res: Response): T[];
  abstract handleError(error: any):Observable<Response>;
}
