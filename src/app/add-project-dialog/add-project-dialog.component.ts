import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit , ElementRef, ViewChild } from '@angular/core';
import { FormGroup , FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ProjectServiceService } from '../services/project-service.service';

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.css']
})
export class AddProjectDialogComponent implements OnInit {
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
    private dialogRef: MatDialogRef<AddProjectDialogComponent>
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
      id: ['', [Validators.required]],
      projectname: ['', [Validators.required]],
      deptcode: ['', [Validators.required]],
      users: ['', [Validators.required]],
      product: ['', Validators.required],
      status: ['', [Validators.required]],
      cieareaid: ['', Validators.required],
      financeproductid: ['', Validators.required],
    });
  }

  addProject() {
    this.addProjectForm.controls['users'].setValue(this.users);
    console.log(this.addProjectForm.value);
    this.projectService.addProject(this.addProjectForm.value).subscribe({
      next:(res) => {
        console.log("Project Added Successfully")
        this.dialogRef.close('add');
      },
      error:(err) => {
        console.log(err);
      }
    })
  }

}
