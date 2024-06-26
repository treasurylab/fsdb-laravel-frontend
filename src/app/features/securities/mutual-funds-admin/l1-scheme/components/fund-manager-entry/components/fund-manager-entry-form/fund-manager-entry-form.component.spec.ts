import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundManagerEntryFormComponent } from './fund-manager-entry-form.component';

describe('FundManagerEntryFormComponent', () => {
  let component: FundManagerEntryFormComponent;
  let fixture: ComponentFixture<FundManagerEntryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundManagerEntryFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FundManagerEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
