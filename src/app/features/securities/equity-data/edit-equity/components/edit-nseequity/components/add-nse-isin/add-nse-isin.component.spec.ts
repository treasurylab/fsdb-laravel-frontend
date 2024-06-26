import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNseIsinComponent } from './add-nse-isin.component';

describe('AddNseIsinComponent', () => {
  let component: AddNseIsinComponent;
  let fixture: ComponentFixture<AddNseIsinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNseIsinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNseIsinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
