import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFileUploadComponent } from './dialog-file-upload.component';

describe('DialogFileUploadComponent', () => {
  let component: DialogFileUploadComponent;
  let fixture: ComponentFixture<DialogFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFileUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
