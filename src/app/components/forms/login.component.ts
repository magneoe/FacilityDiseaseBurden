import {Component} from "@angular/core";
import { Router }  from '@angular/router';
import {User} from "../../models/User.model";
import {AuthorizationService} from "../../services/login.service";


@Component({
  selector: 'login',
  templateUrl: '../../views/login.component.html',
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

      if(this.model.getPassword().length == 0 || this.model.getPassword() === undefined)
        errors.push("No password set");
      if(this.model.getUsername().length == 0 || this.model.getUsername() === undefined)
        errors.push("No username set");

      return errors;
    }

}
