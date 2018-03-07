
import {Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {Program} from "../../../models/Program.model";
import {ProgramFilterAttributeComponent} from "./programFilterAttribute.component";
import {OrganizationUnit} from "../../../models/OrganizationUnit.model";
import {TrackedEntityLoaderService} from "../../../services/dataLoading/TrackedEntityLoaderService.service";
import {TrackedEntityAttribute} from "../../../models/TrackedEntityAttribute.model";

@Component({
  selector: 'programFilter',
  templateUrl: '../../../views/program/programFilter.component.html'
})
export class ProgramFilterComponent implements OnInit {
  _ref:any;
  program:Program;
  selectedOrgUnit:OrganizationUnit;
  RECIEVER_ADDRESS:number;
  MAX_FILTERS:number = 1;

  @ViewChild('filterAttributes', {read: ViewContainerRef}) container: ViewContainerRef;

  constructor(private _cfr: ComponentFactoryResolver,
              private _trackedEntityLoaderServiceService:TrackedEntityLoaderService){}

  ngOnInit(){
  }

  addAttribute(){
    this._trackedEntityLoaderServiceService.getTrackedEntityInstances('trackedEntityInstances?ou=' + this.selectedOrgUnit.id +
      '&program=' + this.program.id + '&pageSize=1&fields=[lastUpdated,attributes]&ouMode=DESCENDANTS').
    subscribe((units:any) => {
      let attributes:TrackedEntityAttribute[] = [];
      if(units.trackedEntityInstances[0] !== null && units.trackedEntityInstances[0] !== undefined){
        attributes = units.trackedEntityInstances[0].attributes;
      }
      let comp = this._cfr.resolveComponentFactory(ProgramFilterAttributeComponent);
      let filterAttributeComp = this.container.createComponent(comp);
      filterAttributeComp.instance._ref = filterAttributeComp;
      filterAttributeComp.instance.setEntityAttributes(attributes);
      filterAttributeComp.instance.setSelectedProgram(this.program);
      filterAttributeComp.instance.setRecieverAddress(this.RECIEVER_ADDRESS);
    });
  }

    setRecieverAddress(RECIEVER_ADDRESS:number):void {
        this.RECIEVER_ADDRESS = RECIEVER_ADDRESS;
    }
    setProgram(program:Program):void {
      console.log('Setting program', program);
      this.program = program;
    }
    setSelectedOrgUnit(selOrgUnit:OrganizationUnit):void {
      this.selectedOrgUnit = selOrgUnit;
    }
    setMaxFilters(MAX_FILTERS:number):void {
      this.MAX_FILTERS = MAX_FILTERS;
    }
}
