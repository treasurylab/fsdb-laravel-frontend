import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundManagerMappingComponent } from './fund-manager-mapping.component';

describe('FundManagerMappingComponent', () => {
  let component: FundManagerMappingComponent;
  let fixture: ComponentFixture<FundManagerMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundManagerMappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FundManagerMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
