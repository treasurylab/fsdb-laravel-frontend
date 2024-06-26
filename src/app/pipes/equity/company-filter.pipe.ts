import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'companyFilter',
})
export class CompanyFilterPipe implements PipeTransform {
  transform(data: any[], keyword: string): any[] {
    if (!data || !keyword || keyword.trim() === '') {
      // Return the original array if the keyword is empty or null
      return data;
    }

    // Convert the keyword to lowercase for case-insensitive matching
    keyword = keyword.toLowerCase();

    return data.filter((item) => {
      return (
        item.symbol.toLowerCase().indexOf(keyword) !== -1 ||
        item.isin_no.toLowerCase().indexOf(keyword) !== -1 ||
        (item.symbol + ' (ISIN: ' + item.isin_no + ')')
          .toLowerCase()
          .indexOf(keyword) !== -1
      );
    });
  }
}
