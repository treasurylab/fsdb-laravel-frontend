import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MclrRateDownloadViewComponent } from './mclr-rate-download-view.component';

describe('MclrRateDownloadViewComponent', () => {
  let component: MclrRateDownloadViewComponent;
  let fixture: ComponentFixture<MclrRateDownloadViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MclrRateDownloadViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MclrRateDownloadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
