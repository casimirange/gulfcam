import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexMangwaComponent } from './index-mangwa.component';

describe('IndexMangwaComponent', () => {
  let component: IndexMangwaComponent;
  let fixture: ComponentFixture<IndexMangwaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexMangwaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexMangwaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
