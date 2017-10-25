import {Component, OnDestroy, ViewChild} from '@angular/core';
import {CustomValidationService} from '../../services/customValidation.service';
import {Subscription} from 'rxjs/Subscription';
import {ValidationMessage} from '../../models/ValidationMessage.model';
import {MapComponent} from "../map/map.component";


@Component({
  selector: 'app',
  templateUrl: '../../views/appMainContainer.component.html',
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

  constructor(private _customValidationService: CustomValidationService) {

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
  select(): void {
    this.mapComponent.updateMap();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
