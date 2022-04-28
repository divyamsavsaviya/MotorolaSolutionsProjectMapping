import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { EmployeeDataService } from '../services/employee-data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectServiceService } from '../services/project-service.service';

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
  showProgressBar = false

  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;

  constructor(
    private employeeService: EmployeeDataService,
    private projectService: ProjectServiceService,
    // private projectManagementComponent: ProjectManagementComponent,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogFileUploadComponent>,
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
        this.showProgressBar = !this.showProgressBar;
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        let headersRow = this.getHeaderArray(csvRecordsArray);
        // divide this.records in chunk
        const chunkSize = 100;

        if (this.data.options === 'users') {
          this.records = this.getUsersDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
          for (let i = 0; i < this.records.length; i += chunkSize) {
            const chunk = this.records.slice(i, i + chunkSize);
            const chunkJsonData = JSON.stringify(chunk);
            this.employeeService.bulkInsert(chunkJsonData).subscribe({
              next: (res) => {
                this.showProgressBar = !this.showProgressBar;
                this.dialogRef.close('bulkInsert');
                console.log(res);
              },
              error: (err) => {
                this.showProgressBar = !this.showProgressBar;
                console.log('error is occurred while inserting chunk !', err);
              }
            })
          }
        } else {
          this.records = this.getProjectsDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
          console.log({ projects: this.records });
          for (let i = 0; i < this.records.length; i += chunkSize) {
            const chunk = this.records.slice(i, i + chunkSize);
            const chunkJsonData = JSON.stringify(chunk);
            this.projectService.bulkInsert(chunkJsonData).subscribe({
              next: (res) => {
                this.showProgressBar = !this.showProgressBar;
                this.dialogRef.close('bulkInsert');
                console.log(res);
  
              },
              error: (err) => {
                this.showProgressBar = !this.showProgressBar;
                console.log('error is occurred while inserting chunk !', err);
              }
            })
          }
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
    for (let i = 1; i < csvRecordsArray.length - 1; i++) {
      let currentRecord = (<string>csvRecordsArray[i]).split(',');
      let csvRecord: Project = new Project();
      csvRecord.projectname = currentRecord[1].trim();
      csvRecord.deptcode = currentRecord[2].trim();
      csvRecord.users = currentRecord[3].trim().split('#%');
      csvRecord.product = currentRecord[4].trim();
      csvRecord.status = currentRecord[5].trim();
      csvRecord.cieareaid = currentRecord[6].trim();
      csvRecord.financeproductid = currentRecord[7].trim();
      // console.log("csvRecord => ", csvRecord);
      //TODO - validation 
      projects.push(csvRecord);
    }
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
