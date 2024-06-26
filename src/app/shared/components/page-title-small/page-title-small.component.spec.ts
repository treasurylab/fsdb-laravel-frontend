import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTitleSmallComponent } from './page-title-small.component';

describe('PageTitleSmallComponent', () => {
  let component: PageTitleSmallComponent;
  let fixture: ComponentFixture<PageTitleSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageTitleSmallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PageTitleSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
