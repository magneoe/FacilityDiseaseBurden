import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/notfound.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthorizationService } from './services/login.service';
import { LoginComponent } from './components/forms/login.component';
import { OrganizationLoaderComponent } from './components/forms/organizationLoader.component';
import { DatePickerComponent } from './components/forms/datePicker.component';
import { OrderByDisplayNamePipe } from './pipes/organizationLoader.pipe';
import { ProgramsComponent } from './components/forms/program/program.component';
import { ProgramsService } from './services/programs.service';
import { CustomValidationService } from './services/customValidation.service';
import { AppMainContainerComponent } from './components/forms/appMainContainer.component';
import { MapComponent } from './components/map/map.component';
import { MapInputDataService } from './services/mapInputData.service';
import {ProgramFilterComponent} from "./components/forms/program/programFilter.component";
import {ProgramFilterAttributeComponent} from "./components/forms/program/programFilterAttribute.component";
import {TrackedEntityLoaderServiceService} from "./services/TrackedEntityLoaderService.service";


const appRoutes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'login', component: LoginComponent},
  { path: 'app', component: AppMainContainerComponent, canActivate: [AuthorizationService]},
  { path: '**', component: AppMainContainerComponent, canActivate: [AuthorizationService]}
];
// path: '', pathMatch: 'full', redirectTo: ''

@NgModule({
  imports:      [ BrowserModule, HttpModule, RouterModule.forRoot(appRoutes),
    FormsModule, ReactiveFormsModule ],
  declarations: [ AppComponent, OrganizationLoaderComponent, PageNotFoundComponent, LoginComponent,
    OrderByDisplayNamePipe, DatePickerComponent,
    AppMainContainerComponent, ProgramsComponent, MapComponent, ProgramFilterComponent, ProgramFilterAttributeComponent ],
  bootstrap:    [ AppComponent ],
  providers: [AuthorizationService, ProgramsService, CustomValidationService, MapInputDataService, TrackedEntityLoaderServiceService ],
  entryComponents: [ProgramFilterComponent, ProgramFilterAttributeComponent]
})
export class AppModule { }
