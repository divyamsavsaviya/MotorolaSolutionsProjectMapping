import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ProjectServiceService } from '../services/project-service.service';

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.css']
})
export class AddProjectDialogComponent implements OnInit {
  actionTitle = 'Add Project';
  actionBtn: string = "Add";
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl();
  filteredUsers !: Observable<string[]>;
  users: string[] = [];
  allUsers: string[] = ['Divyam', 'Saheel', 'Praneeth', 'Vinay'];

  @ViewChild('userInput') userInput !: ElementRef<HTMLInputElement>;

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectServiceService,
    private dialogRef: MatDialogRef<AddProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
  ) {
    this.filteredUsers = this.userCtrl.valueChanges.pipe(
      startWith(null),
      map((user: string | null) => (user ? this._filter(user) : this.allUsers.slice())),
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our user
    if (value) {
      this.users.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.userCtrl.setValue(null);
  }

  remove(user: string): void {
    const index = this.users.indexOf(user);

    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.users.push(event.option.viewValue);
    this.userInput.nativeElement.value = '';
    this.userCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allUsers.filter(user => user.toLowerCase().includes(filterValue));
  }

  addProjectForm !: FormGroup;

  ngOnInit(): void {
    this.addProjectForm = this.formBuilder.group({
      projectname: ['', [Validators.required]],
      deptcode: ['', [Validators.required]],
      users: ['', [Validators.required]],
      product: ['', Validators.required],
      status: ['', [Validators.required]],
      cieareaid: ['', Validators.required],
      financeproductid: ['', Validators.required],
    });

    if (this.editData) {
      this.actionBtn = "Update";
      this.actionTitle = "Update Project";
      this.addProjectForm.controls['projectname'].setValue(this.editData.projectname);
      this.addProjectForm.controls['projectname'].disable();
      this.addProjectForm.controls['deptcode'].setValue(this.editData.deptcode);
      this.addProjectForm.controls['deptcode'].disable();
      this.users = this.editData.users;
      this.addProjectForm.controls['product'].setValue(this.editData.product);
      this.addProjectForm.controls['product'].disable();
      this.addProjectForm.controls['cieareaid'].setValue(this.editData.cieareaid);
      this.addProjectForm.controls['cieareaid'].disable();
      this.addProjectForm.controls['status'].setValue(this.editData.status);
      this.addProjectForm.controls['financeproductid'].setValue(this.editData.financeproductid);
      this.addProjectForm.controls['financeproductid'].disable();
    }
  }

  addProject() {
    if (!this.editData) {
      this.addProjectForm.controls['users'].setValue(this.users);
      console.log(this.addProjectForm.value);
      this.projectService.addProject(this.addProjectForm.value).subscribe({
        next: (res) => {
          console.log("Project Added Successfully")
          this.dialogRef.close('add');
        },
        error: (err) => {
          console.log(err);
        }
      })
    } else {
      this.updateProject();
    }
  }

  // currently users and status can be updated
  updateProject() {
    const users = this.users;
    const status = this.addProjectForm.controls['status'].value;

    // validate data
    this.projectService.updateProject({users,status}).subscribe ({
      next: (res) => {
        this.addProjectForm.reset();
        this.dialogRef.close('update')
      },
      error : (error) => {
        console.error(error.message);
      }
    });
  }

}
