import { Pipe, PipeTransform } from '@angular/core';
import { IMappedClassId } from 'src/app/models/mutual-funds/mapped-class-id.model';

@Pipe({
  name: 'mappedClassIdFilter'
})
export class MappedClassIdFilterPipe implements PipeTransform {

  transform(data: IMappedClassId[], keyword: string): IMappedClassId[] {
    if (!data || !keyword || keyword.trim() === '') {
      // Return the original array if the keyword is empty or null
      return data; 
    }

    // Convert the keyword to lowercase for case-insensitive matching
    keyword = keyword.toLowerCase(); 

    return data.filter(item => {
      return item.class_id.toLowerCase().indexOf(keyword) !== -1
        || item.scheme_id.toLowerCase().indexOf(keyword) !== -1
        || item.scheme_name.toLowerCase().indexOf(keyword) !== -1
        || item.rstatus.toLowerCase().indexOf(keyword) !== -1
        || item.adate.toLowerCase().indexOf(keyword) !== -1;
    });
  }

}
