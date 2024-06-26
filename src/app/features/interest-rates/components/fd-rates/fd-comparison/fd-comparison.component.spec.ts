import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdComparisonComponent } from './fd-comparison.component';

describe('FdComparisonComponent', () => {
  let component: FdComparisonComponent;
  let fixture: ComponentFixture<FdComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FdComparisonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FdComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
