import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuritiesOverviewBlockContentComponent } from './securities-overview-block-content.component';

describe('SecuritiesOverviewBlockContentComponent', () => {
  let component: SecuritiesOverviewBlockContentComponent;
  let fixture: ComponentFixture<SecuritiesOverviewBlockContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecuritiesOverviewBlockContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecuritiesOverviewBlockContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
