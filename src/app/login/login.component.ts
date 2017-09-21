



import {Component} from "@angular/core";
import {User} from "./User";
import {AuthorizationService} from "./login.service";
import { Router }  from '@angular/router';

@Component({
  selector: 'facility-Burden-app',
  templateUrl: 'app/login/login.component.html'
})

export class LoginComponent {
  model = new User('', '', '');
  errorMessage:string = "";

  constructor(private _authorizationService: AuthorizationService, private _router: Router){}


  login():void {
    console.log("Logged in:", this.model);
    if (!this.checkConnectionLink(this.model))
      return;

    this._authorizationService.testConnectivity(this.model).subscribe((isSuccess) => {
        this._authorizationService.setAuthenticated(true);

        //Setting user info in session storage
        sessionStorage.setItem("user", JSON.stringify(this.model));

        //Directing to orgLoader whenever logged in
        this._router.navigate(['/orgLoader']);
        console.log("Success!");
      },
      (error) => {
        this._authorizationService.setAuthenticated(false);
        this.errorMessage = "Could not log in";

      });
  }
    private checkConnectionLink(user:User) :boolean {
      let connectionLink = user.getConnectionLink();
      if(connectionLink.length == 0 || connectionLink === undefined)
      {
        this.errorMessage = "Invalid connection url";
        return false;
      }
      if(!connectionLink.startsWith('http://'))
      {
        this.errorMessage = "The connection url needs to have a protocol prefix e.g: http://";
        return false;
      }
      if(connectionLink.endsWith("/"))
        user.setConnectionLink(connectionLink.slice(0, connectionLink.length-1))
      return true;
    }

}
