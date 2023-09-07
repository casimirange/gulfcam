import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexAmandeComponent } from './index-amande.component';

describe('IndexAmandeComponent', () => {
  let component: IndexAmandeComponent;
  let fixture: ComponentFixture<IndexAmandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexAmandeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexAmandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
