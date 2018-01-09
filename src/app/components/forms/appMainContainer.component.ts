import {Component, OnDestroy, ViewChild} from '@angular/core';
import {CustomValidationService} from '../../services/customValidation.service';
import {Subscription} from 'rxjs/Subscription';
import {ValidationMessage} from '../../models/ValidationMessage.model';
import {MapComponent} from "../map/map.component";
import {TemporalDimensionComponent} from "../temporal/TemporalDimension.component";
import {CommonResourceDispatcherService} from "../../services/dataInput/CommonResourceDispatcher.service";
import {NgProgress} from "ngx-progressbar";
import {IUpdateableComponent} from "../../services/IUpdateable.component";
import {SelectedDatasetManager} from "./selectedDatasetManager.component";


@Component({
  selector: 'app',
  templateUrl: '../../views/appMainContainer.component.html',
  providers: [CommonResourceDispatcherService]
})

/*
 * This component represents the main container for all input forms that sets up the
 * initial search for the map component.
 */
export class AppMainContainerComponent implements OnDestroy {

  protected formIsValid: boolean = false;
  protected errorMessages: Map<string, ValidationMessage> = new Map();
  private subscription: Subscription;
  @ViewChild(MapComponent) mapComponent: MapComponent;
  @ViewChild(TemporalDimensionComponent) temporalComponent: TemporalDimensionComponent;
  @ViewChild(SelectedDatasetManager) selectedDatasetManager: SelectedDatasetManager;

  constructor(private _customValidationService: CustomValidationService,
              private _commonResourceDispatcher:CommonResourceDispatcherService,
              private _ngProgress:NgProgress) {

    // Subscribes to the Validation message service used by the child components for sending validation messages.
    this.subscription = this._customValidationService.getErrorMessage().subscribe(validationMessage => {
        this.handleValidationUpdateEvent(validationMessage);
    });
  }

  /*
   * This methods deals with an incomming validation message
   */
  handleValidationUpdateEvent(validationMessage: ValidationMessage){
    if(!validationMessage.formIsValid)
      this.errorMessages.set(validationMessage.senderId, validationMessage);
    else
      this.errorMessages.delete(validationMessage.senderId);

    if(this.errorMessages.size == 0)
      this.formIsValid = true;
    else
      this.formIsValid = false;
  }
  /*
   * Converts the Validation messages as an array to be iterated in the view
   */
  getErrorMessages():Array<ValidationMessage>{
    let array = new Array<ValidationMessage>();
    this.errorMessages.forEach(item =>{
      array.push(item);
    });
    return array;
  }


  /*
   * The submitting
   */
    select(stackData:boolean): void {
    //Make a list of updateable components;
    let updateableComponents:IUpdateableComponent[] = [];
    updateableComponents.push(this.mapComponent);
    updateableComponents.push(this.temporalComponent);
    updateableComponents.push(this.selectedDatasetManager);

    //The list of components that still not have reported that their are finished
    let pendingComponentsInProgress:IUpdateableComponent[] = [];
    pendingComponentsInProgress = pendingComponentsInProgress.concat(updateableComponents);

    //Upon finshed - remove the component from the pendingComponentsList
    const callOnFinish = (component:any) => { 
      for(let i = 0; i < pendingComponentsInProgress.length; i++){
        if(pendingComponentsInProgress[i] === component) {
          pendingComponentsInProgress = pendingComponentsInProgress.filter(comp => {
            if (comp !== pendingComponentsInProgress[i])
              return true;
          });
        }
      }
      //When all are done, stop the progressbar
      if(pendingComponentsInProgress.length === 0)
      {
        this._ngProgress.done();
        this.mapComponent.setView();
      }
    };

    this._ngProgress.start();
    //To avoid infinite loading...
    setTimeout(() => {
      if(pendingComponentsInProgress.length > 0) {
          alert('The server is too slow, or something went wrong :(');
          pendingComponentsInProgress = [];
          callOnFinish(null);
      }
    }, 1000*120);
    this._commonResourceDispatcher.handleUpdate(updateableComponents, stackData, callOnFinish);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
