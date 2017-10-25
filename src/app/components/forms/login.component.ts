import {Component} from "@angular/core";
import { Router }  from '@angular/router';
import {CustomValidationService} from "../../services/customValidation.service";
import {User} from "../../models/User.model";
import {AuthorizationService} from "../../services/login.service";


@Component({
  selector: 'login',
  templateUrl: '../../views/login.component.html',
  providers: [CustomValidationService]
})

/*
 * Temporary login component - runs basic authentication for now - will be set up with tokens eventually
 */
export class LoginComponent {
  model = new User('', '', '');
  errorMessages:Array<string> = [];

  constructor(public _authorizationService: AuthorizationService,
              private _router: Router){  }


  login():void {
    console.log("Logged in:", this.model);
    this.errorMessages = this.isValid();
    if(this.errorMessages.length > 0)
      return;
    this._authorizationService.login(this.model);
  }


    /*
     * Validation method
     */
    isValid():Array<string> {
      let errors = new Array();
      let connectionLink = this.model.getConnectionLink();

      if(connectionLink.length == 0 || connectionLink === undefined)
        errors.push("Invalid connection url");
      if(this.model.getPassword().length == 0 || this.model.getPassword() === undefined)
        errors.push("No password set");
      if(this.model.getUsername().length == 0 || this.model.getUsername() === undefined)
        errors.push("No username set");
      if(!connectionLink.startsWith('http://'))
        errors.push("The connection url needs to have a protocol prefix e.g: http://");
      if(connectionLink.endsWith("/"))
        this.model.setConnectionLink(connectionLink.slice(0, connectionLink.length-1))

      return errors;
    }

}
