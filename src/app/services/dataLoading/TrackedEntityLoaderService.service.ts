
import {Injectable} from "@angular/core";
import {HttpWrapperService} from "./HttpWrapper.service";
import {TrackedEntity} from "../../models/TrackedEntity.model";
import {Observable} from "rxjs/Observable";
import {Http, Response} from '@angular/http';
import {FilterQuery} from "../../models/FilterQuery.model";
import {Program} from "../../models/Program.model";
import {OrganizationUnit} from "../../models/OrganizationUnit.model";
import {Logger} from "angular2-logger/core";
import {OperatorType} from "../../enums/OperatorType.enum";

@Injectable()
export class TrackedEntityLoaderService extends HttpWrapperService<TrackedEntity>{

  constructor(_http: Http, private _logger:Logger) {
    super(_http, JSON.parse(sessionStorage.getItem("user")));
  }


  // Loads the tracked entity instances from the server
  public getTrackedEntityInstances(query:string): Observable<TrackedEntity[]> {
    return this.get(query).do((data) => console.log(JSON.stringify(data))).catch(this.handleError);
  }
  /*
  * Implements the HttpWrapper service methods
  */
  getAsArray(res: Response): TrackedEntity[] {
    return <TrackedEntity[]> res.json();
  }
  handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error());
  }

  public getTrackedEntityInstancesByQuery(selOrgUnit:OrganizationUnit, selProg:Program, selStartDate:string,
                                   selEndDate:string, filterQueries:Map<string, FilterQuery[]>): Observable<TrackedEntity[]>{
    let orgUnitId = selOrgUnit.id;
    let programId = selProg.id;

    let filterQueryString = '';
    if(filterQueries != null && filterQueries.get(programId) !== undefined) {
      let programQueries = filterQueries.get(programId);
      for(let i = 0; i < programQueries.length; i++) {
        if(programQueries[i].getOperator() !== OperatorType.LESS_THAN)
          filterQueryString += '&filter=';
        filterQueryString += programQueries[i].convertToFormattedQuery();
      }
    }
    return this.getTrackedEntityInstances('/trackedEntityInstances?ou=' + orgUnitId + '&' +
      'program=' + programId + '&programStartDate=' + selStartDate + '&programEndDate=' + selEndDate + '&' +
      'paging=0&fields=[attributes,enrollments]' + filterQueryString);
  }

}
