
import {Pipe, PipeTransform} from '@angular/core';


@Pipe({
  name: 'orderByDisplayNamePipe'
})
/*
 * Orders organisation units by displayName
 */
export class OrderByDisplayNamePipe implements PipeTransform{

  transform(array: Array<string>, args: string): Array<string> {

    if(!array || array === undefined || array.length === 0) return null;

    array.sort((a: any, b: any) => {
      if (a.displayName < b.displayName) {
        return -1;
      } else if (a.displayName > b.displayName) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }

}
