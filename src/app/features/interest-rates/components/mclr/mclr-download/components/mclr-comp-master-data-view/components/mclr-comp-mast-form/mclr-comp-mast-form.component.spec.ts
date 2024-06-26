import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MclrCompMastFormComponent } from './mclr-comp-mast-form.component';

describe('MclrCompMastFormComponent', () => {
  let component: MclrCompMastFormComponent;
  let fixture: ComponentFixture<MclrCompMastFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MclrCompMastFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MclrCompMastFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
