import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MclrRateViewComponent } from './mclr-rate-view.component';

describe('MclrRateViewComponent', () => {
  let component: MclrRateViewComponent;
  let fixture: ComponentFixture<MclrRateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MclrRateViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MclrRateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
