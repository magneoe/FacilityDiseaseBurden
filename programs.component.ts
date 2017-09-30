import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OrganizationUnitLoaderService } from '../orgLoader/organizationUnitLoader.service';
import { ProgramsService } from './programs.service';

import { OrganizationUnit } from '../orgLoader/OrganizationUnit';
import { Programs } from './Programs';

@Component({
    selector: 'my-programs',
    templateUrl: './programs.component.html',
    providers: [ProgramsService, OrganizationUnitLoaderService]
})
export class ProgramsComponent {
    @Input('id') unitId: string;
    programs: Programs[];
    private query: string;

    constructor(
        private _orgLoaderService: OrganizationUnitLoaderService, 
        private _progService: ProgramsService,
        private router: Router
    ) { }

    showPrograms(): void {
        this.query = 'api/organisationUnits?filter=id:eq:' + this.unitId +'&fields=programs[id,displayName]&paging=0';
        
        this._progService.getPrograms(this.query, JSON.parse(sessionStorage.getItem("user")))
                         .subscribe((units:any) => {
                            this.programs = units.organisationUnits[0].programs; 
                        });
    }
}