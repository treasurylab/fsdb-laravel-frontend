import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBlockContainerComponent } from './dashboard-block-container.component';

describe('DashboardBlockContainerComponent', () => {
  let component: DashboardBlockContainerComponent;
  let fixture: ComponentFixture<DashboardBlockContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardBlockContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardBlockContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
