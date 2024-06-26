import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactsheetFormComponent } from './factsheet-form.component';

describe('FactsheetFormComponent', () => {
  let component: FactsheetFormComponent;
  let fixture: ComponentFixture<FactsheetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FactsheetFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactsheetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
