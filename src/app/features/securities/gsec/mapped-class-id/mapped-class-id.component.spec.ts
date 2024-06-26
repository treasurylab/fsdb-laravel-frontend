import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappedClassIdComponent } from './mapped-class-id.component';

describe('MappedidComponent', () => {
  let component: MappedClassIdComponent;
  let fixture: ComponentFixture<MappedClassIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MappedClassIdComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MappedClassIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
