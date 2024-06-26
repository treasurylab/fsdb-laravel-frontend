import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdrateInfoComponent } from './fdrate-info.component';

describe('FdrateInfoComponent', () => {
  let component: FdrateInfoComponent;
  let fixture: ComponentFixture<FdrateInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FdrateInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FdrateInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
