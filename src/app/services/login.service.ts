

import {Injectable} from "@angular/core";
import {Response, Headers, Http, RequestOptions} from "@angular/http";
import {User} from "../models/User";
import {Observable} from "rxjs/Observable";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";

@Injectable()
export class AuthorizationService implements CanActivate {
  authorizationMessage: string = "";


  private options = new RequestOptions({
    method: 'GET',
    headers: new Headers()
  });

  constructor(private _http: Http, private _router: Router) {
  }

  /*
   * Method used for testing connectivity/validity of username/password
   */
  testConnectivity(user: User): Observable<Response> {
    this.options.headers.set('Authorization', 'Basic ' + btoa(user.getUsername() + ':' + user.getPassword()));
    console.log("Header", this.options.headers);

    return this._http.get(user.getConnectionLink() + "/api", this.options).map((response: Response) => response.json()).catch(this.handleError);

  }

  login(user: User) {
    this.testConnectivity(user).subscribe((isSuccess) => {
        //Setting user info in session storage
        sessionStorage.setItem("user", JSON.stringify(user));
        //Directing to orgLoader whenever logged in
        this._router.navigate(['/app']);
        this.authorizationMessage = "Success";
      },
      (error) => {
        this.authorizationMessage = "Wrong username/password"
      });
  }

  //Authorization service function
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    //Whenever not authenticated - navigate to login page
    if (sessionStorage.getItem("user") == null) {
      this._router.navigate(['/login']);
      return false;
    }
    return true;
  }

  /*
   * Support functions
   */
  private handleError(error: Response) {
    console.error('Catch:', error);
    return Observable.throw(error.json().error());
  }
}
