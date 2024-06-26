import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxDashboardComponent } from './fx-dashboard.component';

describe('FxDashboardComponent', () => {
  let component: FxDashboardComponent;
  let fixture: ComponentFixture<FxDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FxDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
