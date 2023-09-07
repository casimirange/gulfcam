import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PretLayoutComponent } from './pret-layout.component';

describe('PretLayoutComponent', () => {
  let component: PretLayoutComponent;
  let fixture: ComponentFixture<PretLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PretLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PretLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
