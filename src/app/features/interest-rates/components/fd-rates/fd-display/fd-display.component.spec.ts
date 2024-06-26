import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdDisplayComponent } from './fd-display.component';

describe('FdDisplayComponent', () => {
  let component: FdDisplayComponent;
  let fixture: ComponentFixture<FdDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FdDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FdDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
