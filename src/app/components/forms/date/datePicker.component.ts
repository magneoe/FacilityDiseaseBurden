import {Component, Input} from "@angular/core";
import {MapInputDataService} from "../../../services/dataInput/mapInputData.service";
import {InputDataMessage} from "../../../models/InputDataMessage.model";
import {InputDataContent} from "../../../enums/InputDataContent.enum";

@Component({
  selector: 'datePicker',
  templateUrl: '../../../views/datePicker.component.html',
})

/*
 * This component represents a datepicking form.
 */
export class DatePickerComponent{

  private readonly senderId:string = "datePicker";
  startDate: string;
  endDate: string;
  @Input()
  private RECIEVER_ADDRESS:number;

  constructor(private _mapInputDataService:MapInputDataService){}

  ngOnInit(){
    this.notifyValueChange(null);
  }

  /*
   * Upon any event in the view (picking dates) this methods is called
   */
  notifyValueChange(event:any):void {
    let inputDataMessageStartDate = new InputDataMessage(null, InputDataContent.START_DATE, this.startDate, this.RECIEVER_ADDRESS);
    let inputDataMessageEndDate = new InputDataMessage(null, InputDataContent.END_DATE, this.endDate, this.RECIEVER_ADDRESS);
    this._mapInputDataService.sendInputDataMessage(inputDataMessageStartDate);
    this._mapInputDataService.sendInputDataMessage(inputDataMessageEndDate);
  }
}
