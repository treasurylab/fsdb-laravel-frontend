import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MclrRateDownloadFormComponent } from './mclr-rate-download-form.component';

describe('MclrRateDownloadFormComponent', () => {
  let component: MclrRateDownloadFormComponent;
  let fixture: ComponentFixture<MclrRateDownloadFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MclrRateDownloadFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MclrRateDownloadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
