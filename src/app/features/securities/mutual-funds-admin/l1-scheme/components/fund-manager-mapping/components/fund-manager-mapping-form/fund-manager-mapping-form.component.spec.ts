import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundManagerMappingFormComponent } from './fund-manager-mapping-form.component';

describe('FundManagerMappingFormComponent', () => {
  let component: FundManagerMappingFormComponent;
  let fixture: ComponentFixture<FundManagerMappingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundManagerMappingFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FundManagerMappingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
