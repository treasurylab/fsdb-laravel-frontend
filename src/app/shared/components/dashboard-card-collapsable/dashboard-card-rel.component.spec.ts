import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCardRelComponent } from './dashboard-card-rel.component';

describe('DashboardCardRelComponent', () => {
  let component: DashboardCardRelComponent;
  let fixture: ComponentFixture<DashboardCardRelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardCardRelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCardRelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
