import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import {HttpModule} from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './components/notfound.component';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {AuthorizationService} from "./services/login.service";
import {LoginComponent} from "./components/forms/login.component";
import {AppMainInputContainerComponent} from "./components/forms/appMainInputContainer.component";
import {OrganizationLoaderComponent} from "./components/forms/organizationLoader.component";
import {DatePickerComponent} from "./components/forms/datePicker.component";
import {OrderByDisplayNamePipe} from "./pipes/organizationLoader.pipe";

const appRoutes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'login', component: LoginComponent},
  { path: 'app', component: AppMainInputContainerComponent, canActivate: [AuthorizationService]},
  { path: '**', component: AppMainInputContainerComponent, canActivate: [AuthorizationService]}
  ]; //path: '', pathMatch: 'full', redirectTo: ''

@NgModule({
  imports:      [ BrowserModule, HttpModule, RouterModule.forRoot(appRoutes), FormsModule, ReactiveFormsModule ],
  declarations: [ AppComponent, OrganizationLoaderComponent, PageNotFoundComponent, LoginComponent,
    OrderByDisplayNamePipe, DatePickerComponent, AppMainInputContainerComponent],
  bootstrap:    [ AppComponent ],
  providers: [AuthorizationService]
})
export class AppModule { }
