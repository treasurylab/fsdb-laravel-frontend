import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabbedDateFormComponent } from './tabbed-date-form.component';

describe('TabbedDateFormComponent', () => {
  let component: TabbedDateFormComponent;
  let fixture: ComponentFixture<TabbedDateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabbedDateFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabbedDateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
