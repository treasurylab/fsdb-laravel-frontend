import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fundhouseFilter',
})
export class FundHouseFilterPipe implements PipeTransform {
  transform(data: any[], keyword: string): any[] {
    if (!data || !keyword || keyword.trim() === '') {
      // Return the original array if the keyword is empty or null
      return data;
    }

    return data.filter((item) => {
      try {
        const idString = String(item.id).toLowerCase();
        const nameString = String(item.name).toLowerCase();

        return (
          idString.indexOf(keyword) !== -1 ||
          nameString.indexOf(keyword) !== -1
        );
      } catch (error) {
        console.error('Error converting to lowercase:', error);
        return false;
      }
    });
  }
}