import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDateFormat',
})
export class CustomDateFormatPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    // Create a Date object from the input value
    const date = new Date(value);

    // Use Angular's DatePipe to format the date as DD/MM/YYYY
    const formattedDate = new DatePipe('en-US').transform(date, 'dd/MM/yyyy');

    return formattedDate || '';
  }
}
