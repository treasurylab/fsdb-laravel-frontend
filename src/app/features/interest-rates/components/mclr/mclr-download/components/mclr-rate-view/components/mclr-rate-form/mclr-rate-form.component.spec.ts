import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MclrRateFormComponent } from './mclr-rate-form.component';

describe('MclrRateFormComponent', () => {
  let component: MclrRateFormComponent;
  let fixture: ComponentFixture<MclrRateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MclrRateFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MclrRateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
