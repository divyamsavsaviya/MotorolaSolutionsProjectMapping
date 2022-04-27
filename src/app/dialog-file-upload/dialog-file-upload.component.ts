import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { EmployeeDataService } from '../services/employee-data.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as csvToJson from ('convert-csv-to-json');

export class User {
  public email: any;
  public password: any;
  public role: any;
  public name: any;
}

export class Project {
  public projectname: any;
  public deptcode: any;
  public users: any;
  public product: any;
  public status: any;
  public createdat: any;
  public updatedat: any;
  public cieareaid: any;
  public financeproductid: any;
}
@Component({
  selector: 'app-dialog-file-upload',
  templateUrl: './dialog-file-upload.component.html',
  styleUrls: ['./dialog-file-upload.component.css']
})

export class DialogFileUploadComponent implements OnInit {

  @ViewChild('fileInput') fileInput !: ElementRef;
  fileAttr = 'Choose File';
  showUpload = true;

  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;

  constructor(
    private employeeService: EmployeeDataService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  uploadListener($event: any) {

    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {
      this.showUpload = !this.showUpload;
      this.fileAttr = files[0].name;
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        let headersRow = this.getHeaderArray(csvRecordsArray);

        if (this.data.options === 'users') {
          this.records = this.getUsersDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        } else {
          console.log(headersRow);
          this.records = this.getProjectsDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        }

        // divide this.records in chunk
        const chunkSize = 100;
        for (let i = 0; i < this.records.length; i += chunkSize) {
          const chunk = this.records.slice(i, i + chunkSize);
          //convert chunk data into json 
          const chunkJsonData = JSON.stringify(chunk);
          this.employeeService.bulkInsert(chunkJsonData).subscribe({
            next: (res) => {
              console.log(res);
            },
            error: (err) => {
              console.log('error is occurred while inserting chunk !' , chunkJsonData);
            }
          })
        }

      };

      reader.onerror = function () {
        console.log('error is occurred while reading file!');
      };

    } else {
      this.showUpload = !this.showUpload;
      this.fileAttr = 'Choose File';
      alert("Please import valid .csv file.");
    }
  }

  getUsersDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let users = [];
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let currentRecord = (<string>csvRecordsArray[i]).split(',');
      if (currentRecord.length == headerLength) {
        let csvRecord: User = new User();
        csvRecord.email = currentRecord[0].trim();
        csvRecord.name = currentRecord[1].trim();
        csvRecord.role = currentRecord[2].trim();
        csvRecord.password = currentRecord[3].trim();
        //encrypt password using bcrypt
        //TODO - validation 
        users.push(csvRecord);
      }
    }
    return users;
  }

  getProjectsDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let projects = [];
    // console.log(csvRecordsArray);
    for (let i = 1; i < csvRecordsArray.length; i++) {



      let currentRecord = (<string>csvRecordsArray[i]).split(',');
      console.log("currentRecord => ", currentRecord);
      if (currentRecord.length == headerLength) {
        let csvRecord: Project = new Project();
        csvRecord.projectname = currentRecord[0].trim();
        csvRecord.deptcode = currentRecord[1].trim();

        

        csvRecord.users = currentRecord[2].trim();
        csvRecord.product = currentRecord[3].trim();
        csvRecord.status = currentRecord[4].trim();
        csvRecord.createdat = currentRecord[5].trim();
        csvRecord.updatedat = currentRecord[6].trim();
        csvRecord.cieareaid = currentRecord[7].trim();
        csvRecord.financeproductid = currentRecord[8].trim();
        console.log("csvRecord => ", csvRecord);
        //encrypt password using bcrypt
        //TODO - validation 
        projects.push(csvRecord);
      }
    }
    console.log("projects => ", projects);
    return projects;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }
}
