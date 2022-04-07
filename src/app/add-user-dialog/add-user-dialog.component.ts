import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EmployeeDataService } from '../services/employee-data.service';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent implements OnInit {

  actionBtn: string = "Add";
  showPassword: boolean = false;
  hide: boolean = true;
  disable: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeDataService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<AddUserDialogComponent>) { }

  addUserForm !: FormGroup;

  ngOnInit(): void {
    this.addUserForm = this.formBuilder.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
    });

    if (this.editData) {
      console.log(this.editData);
      this.showPassword=true;
      this.actionBtn = "Update";
      this.addUserForm.controls['id'].setValue(this.editData.id);
      this.addUserForm.controls['email'].setValue(this.editData.email);
      this.addUserForm.controls['name'].setValue(this.editData.name);
      this.addUserForm.controls['role'].setValue(this.editData.role);
    }
  }

  roles: String[] = [
    "Admin",
    "Editor",
    "Viewer"
  ];

  teams: String[] = [
    "Team 1",
    "Team 2",
    "Team 3"
  ];

  addUser() {
    if(!this.editData) {
      if (this.addUserForm.valid) {
        console.log(this.addUserForm.value);
        this.employeeService.addEmployee(this.addUserForm.value).subscribe({
            next: (res) => {
              console.log("Added Successfully");
              this.dialogRef.close();
            },
            error: (error) => {
              console.log(error.message);
            }
          });
      }
    } {
      this.updateUser();
    }
  }

  updateUser() {
    this.employeeService.updateEmployee(this.addUserForm.value).subscribe({
      next:(res)=>{
        alert("User updated successfully");
        this.addUserForm.reset();
        this.dialogRef.close('update');
      },
      error:(error)=>{
        alert("Error while updating user");
        console.error(error.message);
      }
    })
  }
}
