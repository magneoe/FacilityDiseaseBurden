import {Pipe, PipeTransform} from '@angular/core';


@Pipe({
  name: 'validateConnectionLinkPipe'
})

export class ValidateConnectionLinkPipe implements PipeTransform {

  transform(connectionLink: string): string {
    if(!connectionLink || connectionLink === undefined || connectionLink.length === 0) return null;


  }
}
