import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenorChipsComponent } from './tenor-chips.component';

describe('TenorChipsComponent', () => {
  let component: TenorChipsComponent;
  let fixture: ComponentFixture<TenorChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenorChipsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TenorChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
