import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexSeanceComponent } from './index-seance.component';

describe('IndexSeanceComponent', () => {
  let component: IndexSeanceComponent;
  let fixture: ComponentFixture<IndexSeanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexSeanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexSeanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
