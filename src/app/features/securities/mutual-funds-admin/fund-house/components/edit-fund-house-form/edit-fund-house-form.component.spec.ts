import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFundHouseFormComponent } from './edit-fund-house-form.component';

describe('EditFundHouseFormComponent', () => {
  let component: EditFundHouseFormComponent;
  let fixture: ComponentFixture<EditFundHouseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditFundHouseFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditFundHouseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
