import { Component, Inject, OnInit } from '@angular/core';
import { EmployeeDataService } from '../services/employee-data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Employee {
  id: number;
  email: string;
  team: string;
}

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css']
})
export class EditUserDialogComponent implements OnInit {

  constructor(
    private employeeService: EmployeeDataService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<EditUserDialogComponent>
  ) { }

  editUserForm !: FormGroup;
  roles: String[] = [
    "Admin",
    "Editor",
    "Viewer"
  ];

  ngOnInit(): void {
    this.editUserForm = this.formBuilder.group({
      role: ['', Validators.required],
    });

    console.log(this.editData);
    if (this.editData) {
      this.editUserForm.controls['id'].setValue(this.editData.id);
      this.editUserForm.controls['email'].setValue(this.editData.email);
      this.editUserForm.controls['name'].setValue(this.editData.name);
      this.editUserForm.controls['role'].setValue(this.editData.role);
    }

  }

  editUSer() {
    this.employeeService.updateEmployee(this.editUserForm.value).subscribe({
      next: (res) => {
        alert("User updated successfully");
        this.editUserForm.reset();
        this.dialogRef.close('update');
      },
      error: (error) => {
        alert("Error while updating user");
        console.error(error.message);
      }
    })
  }
}

