import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EmployeeDataService } from '../services/employee-data.service';


export class User {
  public email: any;
  public password: any;
  public role: any;
  public name: any;
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

        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);

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

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let currentRecord = (<string>csvRecordsArray[i]).split(',');
      if (currentRecord.length == headerLength) {
        let csvRecord: User = new User();
        csvRecord.email = currentRecord[0].trim();
        csvRecord.name = currentRecord[1].trim();
        csvRecord.role = currentRecord[2].trim();
        //encrypt password using bcrypt
        //TODO - validation 
        csvArr.push(csvRecord);
      }
    }
    return csvArr;
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
