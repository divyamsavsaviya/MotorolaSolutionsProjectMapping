import { Injectable } from '@angular/core';
import * as e from 'express';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  // pass data , file name , headers =  ['name','age', 'average', 'approved', 'description']
  downloadFile(data: any, filename = 'data', headerList: any) {
    let csvData = this.ConvertToCSV(data, headerList);
    // A Blob object represents a file-like object of immutable, raw data.
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray: any, headerList: any) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';

    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in headerList) {
        let head = headerList[index];
        let value = array[i][head];
        console.log(i + typeof (value) + value );
        if (typeof (value) === 'object' && value !== null ) {
          let users = value.join('#%');
          line += users+','  ;
        } else {
          line += value+ ',' ;
        }
      }
      str += line + '\r\n';
    }
    return str;
  }
}
