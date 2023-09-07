import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutAmandeComponent } from './layout-amande.component';

describe('LayoutAmandeComponent', () => {
  let component: LayoutAmandeComponent;
  let fixture: ComponentFixture<LayoutAmandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutAmandeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutAmandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
