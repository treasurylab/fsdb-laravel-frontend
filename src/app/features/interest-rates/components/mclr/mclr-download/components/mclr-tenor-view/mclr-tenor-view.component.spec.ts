import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MclrTenorViewComponent } from './mclr-tenor-view.component';

describe('MclrTenorViewComponent', () => {
  let component: MclrTenorViewComponent;
  let fixture: ComponentFixture<MclrTenorViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MclrTenorViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MclrTenorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
