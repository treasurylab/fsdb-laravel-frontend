import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDemoComponent } from './widget-demo.component';

describe('WidgetDemoComponent', () => {
  let component: WidgetDemoComponent;
  let fixture: ComponentFixture<WidgetDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetDemoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WidgetDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
