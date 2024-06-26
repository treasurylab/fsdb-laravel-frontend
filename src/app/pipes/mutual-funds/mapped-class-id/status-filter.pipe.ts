import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusFilter'
})
export class StatusFilterPipe implements PipeTransform {

  transform(data: any[], keyword: string): any[] {
    if (!data || !keyword || keyword.trim() === '' || keyword === 'all') {
      // Return the original array if the keyword is empty or null
      return data; 
    }
 
    if (keyword == "active") {
      keyword = "a";
    } else {
      keyword = "x";
    }
    return data.filter(item => {
      return item.rstatus.toLowerCase().indexOf(keyword) !== -1;
    });
  }

}
