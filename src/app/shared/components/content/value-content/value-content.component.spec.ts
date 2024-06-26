import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueContentComponent } from './value-content.component';

describe('ValueContentComponent', () => {
  let component: ValueContentComponent;
  let fixture: ComponentFixture<ValueContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValueContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValueContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
