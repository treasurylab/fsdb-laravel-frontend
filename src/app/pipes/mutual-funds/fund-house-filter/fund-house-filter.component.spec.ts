import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundHouseFilterPipe } from './fund-house-filter.component';

describe('FundHouseFilterPipe', () => {
  let component: FundHouseFilterPipe;
  let fixture: ComponentFixture<FundHouseFilterPipe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundHouseFilterPipe ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundHouseFilterPipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
