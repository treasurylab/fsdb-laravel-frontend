import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdCalculatorComponent } from './fd-calculator.component';

describe('FdCalculatorComponent', () => {
  let component: FdCalculatorComponent;
  let fixture: ComponentFixture<FdCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FdCalculatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FdCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
