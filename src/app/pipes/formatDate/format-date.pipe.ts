import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): string {
    if (value){
      return String(value[2]).padStart(2, '0')+'-'+String(value[1]).padStart(2, '0')+'-'+String(value[0]).padStart(2, '0');
    }
    return '';
  }

}
