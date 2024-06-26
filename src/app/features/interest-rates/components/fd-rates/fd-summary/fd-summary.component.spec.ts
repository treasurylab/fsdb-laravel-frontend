import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdSummaryComponent } from './fd-summary.component';

describe('FdSummaryComponent', () => {
  let component: FdSummaryComponent;
  let fixture: ComponentFixture<FdSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FdSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FdSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
