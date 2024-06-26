import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxRateContainerComponent } from './fx-rate-container.component';

describe('FxRateContainerComponent', () => {
  let component: FxRateContainerComponent;
  let fixture: ComponentFixture<FxRateContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FxRateContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FxRateContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
