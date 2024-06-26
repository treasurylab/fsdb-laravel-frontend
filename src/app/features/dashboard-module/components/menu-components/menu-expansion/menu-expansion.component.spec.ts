import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuExpansionComponent } from './menu-expansion.component';

describe('MenuExpansionComponent', () => {
  let component: MenuExpansionComponent;
  let fixture: ComponentFixture<MenuExpansionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuExpansionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
