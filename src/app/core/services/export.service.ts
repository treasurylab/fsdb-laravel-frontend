import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { parse } from 'json2csv';
//import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  exportToCsv(customizedRatelist: any, filename: any) {
    throw new Error('Method not implemented.');
  }
  exportAsExcelFile(tbillrateList: any, arg1: string) {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) {}


  /* downloadFile1(data: any[], filename: string) {
    const csvData = this.convertToCsv(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    // saveAs(blob, `${filename}.csv`);
  }

  convertToCsv(data: any[]) {
    const headers = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map((d) => Object.values(d).join(',') + '\n');
    return headers + rows.join('');
  } */

  downloadFile(data: any[], filename='data') {
    let csvData = this.ConvertToCSV(data);
    // console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
}

ConvertToCSV(data: any[]) {
    const headers = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map((d) => Object.values(d).join(',') + '\n');
    return headers + rows.join('');
 }


}
