import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuBuilderComponent } from './menu-builder.component';

describe('MenuBuilderComponent', () => {
  let component: MenuBuilderComponent;
  let fixture: ComponentFixture<MenuBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuBuilderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
