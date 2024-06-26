import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBseIsinComponent } from './add-bse-isin.component';

describe('AddBseIsinComponent', () => {
  let component: AddBseIsinComponent;
  let fixture: ComponentFixture<AddBseIsinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddBseIsinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddBseIsinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
