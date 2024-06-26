import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactsheetComponent } from './factsheet.component';

describe('FactsheetComponent', () => {
  let component: FactsheetComponent;
  let fixture: ComponentFixture<FactsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FactsheetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
