import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdHistoryComponent } from './fd-history.component';

describe('FdHistoryComponent', () => {
  let component: FdHistoryComponent;
  let fixture: ComponentFixture<FdHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FdHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FdHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
