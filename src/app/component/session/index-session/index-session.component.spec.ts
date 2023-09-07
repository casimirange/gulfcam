import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexSessionComponent } from './index-session.component';

describe('IndexSessionComponent', () => {
  let component: IndexSessionComponent;
  let fixture: ComponentFixture<IndexSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexSessionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
