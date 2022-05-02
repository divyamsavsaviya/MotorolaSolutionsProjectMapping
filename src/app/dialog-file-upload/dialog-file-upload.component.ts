import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { EmployeeDataService } from '../services/employee-data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectServiceService } from '../services/project-service.service';
import { FileService } from '../services/file.service';
import { Router } from '@angular/router';

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
  showProgressBar = false

  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;

  constructor(
    private employeeService: EmployeeDataService,
    private projectService: ProjectServiceService,
    private fileService: FileService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogFileUploadComponent>,
  ) { }

  ngOnInit(): void {
  }

  uploadListener($event: any) {

    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {
      this.fileAttr = files[0].name;
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        this.showProgressBar = !this.showProgressBar;
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        let headersRow = this.getHeaderArray(csvRecordsArray);
        if (this.isValidCsvHeaders(headersRow)) {
          const chunkSize = 100;
          if (this.data.options === 'users') {
            this.records = this.getUsersDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
            if ((this.records)) {
              for (let i = 0; i < this.records.length; i += chunkSize) {
                const chunk = this.records.slice(i, i + chunkSize);
                const chunkJsonData = JSON.stringify(chunk);
                this.employeeService.bulkInsert(chunkJsonData).subscribe({
                  next: (res) => {
                    console.log(res);
                    this.dialogRef.close('bulkInsert');
                    console.log(res);
                  },
                  error: (err) => {
                    if(err.status === 401) {
                      this.router.navigate(['/login'])
                    }
                    this.showProgressBar = !this.showProgressBar;
                    console.log('error is occurred while inserting chunk !', err);
                  }
                })
              }
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
                  if(err.status === 401) {
                    this.router.navigate(['/login'])
                  }
                  this.showProgressBar = !this.showProgressBar;
                  console.log('error is occurred while inserting chunk !', err);
                }
              })
            }
          }
        } else {
          this.dialogRef.close();
          let userHeaders = "email,name,role,password";
          let projectHeaders = "id,projectname,deptcode,users,product,status,cieareaid,financeproductid";
          if (this.data.options === 'users') {
            alert("file should contians => " + userHeaders);
          }
          else {
            alert("file should contians => " + projectHeaders);
          }
        }

      };

      reader.onerror = function () {
        console.log('error is occurred while reading file!');
      };

    } else {
      this.fileAttr = 'Choose File';
      alert("Please import valid .csv file.");
      this.dialogRef.close();
    }
  }

  getUsersDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let validUsers = [];
    let invalidUsers = [];
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let currentRecord = (<string>csvRecordsArray[i]).split(',');
      if (currentRecord.length == headerLength) {
        let csvRecord: User = new User();
        csvRecord.email = currentRecord[0].trim();
        csvRecord.name = currentRecord[1].trim();
        csvRecord.role = currentRecord[2].trim();
        csvRecord.password = currentRecord[3].trim();
        if ((!this.isEmailValid(csvRecord.email) || !this.isNameValid(csvRecord.name) || !this.isRoleValid(csvRecord.role) || !this.isPasswordValid(csvRecord.password))) {
          invalidUsers.push(csvRecord);
        }
        else {
          validUsers.push(csvRecord);
        }
      }
    }
    if(invalidUsers.length > 0 ){
      this.exportInvalidProjects(invalidUsers);
    }
    return validUsers;
  }

  isEmailValid(email: any) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    return re.test(email);
  }
  isNameValid(name: any) {
    var re = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    return re.test(name);
  }
  isRoleValid(role: any) {
    switch (role) {
      case 'Admin':
        return true;
      case 'Editor':
        return true;
      case 'Viewer':
        return true;
    }
    return false;
  }
  isPasswordValid(password: any) {
    return password.length < 6 ? false : true;
  }

  getProjectsDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let validProjects = [];
    let invalidProjects = [];
    for (let i = 1; i < csvRecordsArray.length - 1; i++) {
      let currentRecord = (<string>csvRecordsArray[i]).split(',');
      let csvRecord: Project = new Project();
      csvRecord.projectname = currentRecord[0].trim();
      csvRecord.deptcode = currentRecord[1].trim();
      csvRecord.users = currentRecord[2].trim().split('#%');
      csvRecord.product = currentRecord[3].trim();
      csvRecord.status = currentRecord[4].trim();
      csvRecord.cieareaid = currentRecord[5].trim();
      csvRecord.financeproductid = currentRecord[6].trim();
      if (
        !this.isProjectNameValid(csvRecord.projectname) ||
        !this.isProjectDeptCodeValid(csvRecord.deptcode) ||
        !this.isProjectUsersValid(csvRecord.users) ||
        !this.isProjectProductValid(csvRecord.product) ||
        !this.isProjectStatusValid(csvRecord.status) ||
        !this.isProjectCieAreaIdValid(csvRecord.cieareaid) ||
        !this.isProjectFinanceProductIdValid(csvRecord.financeproductid)) {
        invalidProjects.push(csvRecord);
      }
      else {
        validProjects.push(csvRecord);
      }
    }
    if(invalidProjects.length > 0 ){
      this.exportInvalidProjects(invalidProjects);
    }
    return validProjects;
  }

  isProjectNameValid(name: any) {
    return this.isNameValid(name);
  }
  isProjectDeptCodeValid(deptcode: any) {
    // deptcode should only contains letters and numbers
    console.log("deptcode => ",deptcode);
    let re = /^[a-zA-Z\d]+$/;
    return re.test(deptcode);
  }
  isProjectUsersValid(users: any) {
    let invalidUser = 0;
    users.forEach((user: any) => {
      if (!this.isNameValid(user)) {
        invalidUser++;
      }
    })
    return invalidUser === 0 ? true : false;
  }
  isProjectProductValid(product : any) {
    return this.isNameValid(product);
  }
  isProjectStatusValid(status: any) {
    return true;
  }
  isProjectCieAreaIdValid(cieareaid: any) {
    // cieareaid should only contains numbers
    let re = /^[\d]+$/;
    return re.test(cieareaid);
  }
  isProjectFinanceProductIdValid(financeproductid: any) {
    // cieareaid should only contains numbers
    let re = /^[\d]+$/;
    return re.test(financeproductid);
  }

  exportInvalidUsers(invalidUsers: any) {
    const headerList = ['email', 'name', 'role', 'password'];
    this.fileService.downloadFile(invalidUsers, 'invalid_users', headerList);
  }

  exportInvalidProjects(invalidProjects: any) {
    const headerList = ['projectname', 'deptcode', 'users', 'product', 'status', 'cieareaid', 'financeproductid'];
    this.fileService.downloadFile(invalidProjects, 'invalid_projects', headerList);
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  isValidCsvHeaders(headers: any) {
    if (this.data.options === 'users') {
      if (headers[0] === 'email' && headers[1] === 'name' &&
        headers[2] === 'role' && headers[3] === 'password') {
        return true;
      }
    }
    else {
      if (headers[0] === 'projectname' &&
        headers[1] === 'deptcode' && headers[2] === 'users' &&
        headers[3] === 'product' && headers[4] === 'status' &&
        headers[5] === 'cieareaid' && headers[6] === 'financeproductid') {
        return true;
      }
    }
    return false;
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    console.log(headers);
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }
}
