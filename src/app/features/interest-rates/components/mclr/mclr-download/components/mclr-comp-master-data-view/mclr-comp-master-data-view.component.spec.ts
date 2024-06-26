import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MclrCompMasterDataViewComponent } from './mclr-comp-master-data-view.component';

describe('MclrCompMasterDataViewComponent', () => {
  let component: MclrCompMasterDataViewComponent;
  let fixture: ComponentFixture<MclrCompMasterDataViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MclrCompMasterDataViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MclrCompMasterDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
