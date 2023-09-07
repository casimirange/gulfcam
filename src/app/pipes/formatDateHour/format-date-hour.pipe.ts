import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDateHour'
})
export class FormatDateHourPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    if (value){
      return String(value[2]).padStart(2, '0')+'-'+String(value[1]).padStart(2, '0')+'-'+String(value[0]).padStart(2, '0')+' à '+String(value[3]).padStart(2, '0')+'h'+String(value[4]).padStart(2, '0');
    }

    return '';

  }

}
