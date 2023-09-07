import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangwaLayoutComponent } from './mangwa-layout.component';

describe('MangwaLayoutComponent', () => {
  let component: MangwaLayoutComponent;
  let fixture: ComponentFixture<MangwaLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MangwaLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MangwaLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
