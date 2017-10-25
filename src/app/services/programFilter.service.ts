
import {HttpWrapperService} from "./HttpWrapper.service";
import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {EntityAttribute} from "../models/entityAttribute.model";

/*
@Injectable()
export class ProgramsFilterService extends HttpWrapperService<EntityAttribute>{


  constructor(_http: Http) {
    super(_http, JSON.parse(sessionStorage.getItem("user")));
  }

  loadEntityAttributes(query: string): Observable<EntityAttribute[]> {
    return this.get(query).do(data => console.log(JSON.stringify(data))).catch(this.handleError);
  }
  */
  /*
   * Implements the HttpWrapper service methods
   */
/*
  getAsArray(res: Response):EntityAttribute[]{
    return <EntityAttribute[]> res.json();
  }
  handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error());
  }
}
*/
