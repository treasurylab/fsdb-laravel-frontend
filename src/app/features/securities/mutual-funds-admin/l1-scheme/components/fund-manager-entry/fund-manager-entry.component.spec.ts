import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundManagerEntryComponent } from './fund-manager-entry.component';

describe('FundManagerEntryComponent', () => {
  let component: FundManagerEntryComponent;
  let fixture: ComponentFixture<FundManagerEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundManagerEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FundManagerEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
