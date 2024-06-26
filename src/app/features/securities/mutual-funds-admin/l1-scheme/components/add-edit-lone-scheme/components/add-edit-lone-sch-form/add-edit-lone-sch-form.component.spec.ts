import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditLoneSchFormComponent } from './add-edit-lone-sch-form.component';

describe('AddEditLoneSchFormComponent', () => {
  let component: AddEditLoneSchFormComponent;
  let fixture: ComponentFixture<AddEditLoneSchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditLoneSchFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditLoneSchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
