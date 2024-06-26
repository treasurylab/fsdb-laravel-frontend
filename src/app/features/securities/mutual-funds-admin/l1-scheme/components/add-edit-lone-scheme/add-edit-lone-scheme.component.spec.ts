import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditLoneSchemeComponent } from './add-edit-lone-scheme.component';

describe('AddEditLoneSchemeComponent', () => {
  let component: AddEditLoneSchemeComponent;
  let fixture: ComponentFixture<AddEditLoneSchemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditLoneSchemeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditLoneSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
