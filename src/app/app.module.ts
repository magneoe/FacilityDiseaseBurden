import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import {HttpModule} from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './notfound.component';
import {FormsModule} from '@angular/forms';
import {OrganizationLoaderComponent} from "./orgLoader/organizationLoader.component";
import {LoginComponent} from "./login/login.component";
import { ReactiveFormsModule } from '@angular/forms';
import {AuthorizationService} from "./login/login.service";
import {OrderByDisplayNamePipe} from "./orgLoader/organizationLoader.pipe";

const appRoutes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'login', component: LoginComponent},
  { path: 'orgLoader', component: OrganizationLoaderComponent, canActivate: [AuthorizationService]},
  { path: '**', component: OrganizationLoaderComponent, canActivate: [AuthorizationService]}
  ]; //path: '', pathMatch: 'full', redirectTo: ''

@NgModule({
  imports:      [ BrowserModule, HttpModule, RouterModule.forRoot(appRoutes), FormsModule, ReactiveFormsModule ],
  declarations: [ AppComponent, OrganizationLoaderComponent, PageNotFoundComponent, LoginComponent, OrderByDisplayNamePipe],
  bootstrap:    [ AppComponent ],
  providers: [AuthorizationService]
})
export class AppModule { }
