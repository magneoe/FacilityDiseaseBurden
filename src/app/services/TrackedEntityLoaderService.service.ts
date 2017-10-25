
import {Injectable} from "@angular/core";
import {HttpWrapperService} from "./HttpWrapper.service";
import {TrackedEntity} from "../models/TrackedEntity.model";
import {Observable} from "rxjs/Observable";
import {Http, Response} from '@angular/http';

@Injectable()
export class TrackedEntityLoaderServiceService extends HttpWrapperService<TrackedEntity>{


  constructor(_http: Http) {
    super(_http, JSON.parse(sessionStorage.getItem("user")));
  }

  // Loads the tracked entity instances from the server
  public getTrackedEntityInstances(query: string): Observable<TrackedEntity[]> {
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
}
