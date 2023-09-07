import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PretIndexComponent } from './pret-index.component';

describe('PretIndexComponent', () => {
  let component: PretIndexComponent;
  let fixture: ComponentFixture<PretIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PretIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PretIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
