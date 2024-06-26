import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'aumListFilter'
})
export class AumListFilterPipe implements PipeTransform {

  transform(data: any[], keyword: string): any[] {
    if (!data || !keyword || keyword.trim() === '') {
      // Return the original array if the keyword is empty or null
      return data; 
    }

    // Convert the keyword to lowercase for case-insensitive matching
    keyword = keyword.toLowerCase(); 

    return data.filter(item => {
      return item.class_id.toLowerCase().indexOf(keyword) !== -1
        || item.scheme_id.toLowerCase().indexOf(keyword) !== -1
        || item.scheme_name.toLowerCase().indexOf(keyword) !== -1;
    });
  }

}
