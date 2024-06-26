import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableChipsComponent } from './table-chips.component';

describe('TableChipsComponent', () => {
  let component: TableChipsComponent;
  let fixture: ComponentFixture<TableChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableChipsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
