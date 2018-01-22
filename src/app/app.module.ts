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
import { OrganizationLoaderComponent } from './components/forms/org/organizationLoader.component';
import { DatePickerComponent } from './components/forms/date/datePicker.component';
import { OrderByDisplayNamePipe } from './pipes/organizationLoader.pipe';
import { ProgramsComponent } from './components/forms/program/program.component';
import { ProgramsService } from './services/dataLoading/programs.service';
import { AppMainContainerComponent } from './components/forms/appMainContainer.component';
import { MapComponent } from './components/map/map.component';
import { MapInputDataService } from './services/dataInput/mapInputData.service';
import {ProgramFilterComponent} from "./components/forms/program/programFilter.component";
import {ProgramFilterAttributeComponent} from "./components/forms/program/programFilterAttribute.component";
import {TrackedEntityLoaderService} from "./services/dataLoading/TrackedEntityLoaderService.service";
import {LOG_LOGGER_PROVIDERS} from "angular2-logger/core";
import {TemporalDimensionComponent} from "./components/temporal/temporalDimension.component";
import {OrganizationUnitLoaderService} from "./services/dataLoading/organizationUnitLoader.service";
import {NgProgressModule} from "ngx-progressbar";
import {APP_BASE_HREF} from "@angular/common"; //Do not remove this!!!
import {SelectedDatasetManager} from "./components/forms/selectedDatasetManager.component";
import {ChartsModule} from "ng2-charts";
import {LinechartComponent} from "./components/temporal/linechart.component";
import {CommonResourceDispatcherService} from "./services/dataInput/CommonResourceDispatcher.service";
import {PiechartComponent} from "./components/temporal/piechart.component";


const appRoutes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'login', component: LoginComponent},
  { path: 'app', component: AppMainContainerComponent, canActivate: [AuthorizationService]},
  { path: '**', component: AppMainContainerComponent, canActivate: [AuthorizationService]}
];
// path: '', pathMatch: 'full', redirectTo: ''

@NgModule({
  imports:      [ BrowserModule, HttpModule, RouterModule.forRoot(appRoutes),
    FormsModule, ReactiveFormsModule, NgProgressModule, ChartsModule ],
  declarations: [ AppComponent, OrganizationLoaderComponent, PageNotFoundComponent, LoginComponent,
    OrderByDisplayNamePipe, DatePickerComponent,
    AppMainContainerComponent, ProgramsComponent, MapComponent,
      ProgramFilterComponent, ProgramFilterAttributeComponent, TemporalDimensionComponent,
      SelectedDatasetManager, LinechartComponent, PiechartComponent],
  bootstrap:    [ AppComponent ],
  providers: [AuthorizationService, ProgramsService,
      MapInputDataService, TrackedEntityLoaderService,
      OrganizationUnitLoaderService, LOG_LOGGER_PROVIDERS,
      CommonResourceDispatcherService,
      ],
  entryComponents: [ProgramFilterComponent, ProgramFilterAttributeComponent]
})
export class AppModule { }
