import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutDisciplineComponent } from './layout-discipline.component';

describe('LayoutDisciplineComponent', () => {
  let component: LayoutDisciplineComponent;
  let fixture: ComponentFixture<LayoutDisciplineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutDisciplineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutDisciplineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
