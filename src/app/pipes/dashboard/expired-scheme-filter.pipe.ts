import { Pipe, PipeTransform } from '@angular/core';
import { IExpiredScheme } from 'src/app/models/dashboard/expired-scheme.model';

@Pipe({
  name: 'expiredSchemeFilter'
})
export class ExpiredSchemeFilterPipe implements PipeTransform {
  transform(data: IExpiredScheme[], keyword: string): any[] {
    if (!data || !keyword || keyword.trim() === '') {
      // Return the original array if the keyword is empty or null
      return data; 
    }

    // Convert the keyword to lowercase for case-insensitive matching
    keyword = keyword.toLowerCase(); 

    return data.filter(item => {
      return item.scheme_name.toLowerCase().indexOf(keyword) !== -1
        || item.scheme_id.toLowerCase().indexOf(keyword) !== -1;
    });
  }
}
