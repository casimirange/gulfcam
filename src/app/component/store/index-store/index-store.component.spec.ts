import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexStoreComponent } from './index-store.component';

describe('IndexStoreComponent', () => {
  let component: IndexStoreComponent;
  let fixture: ComponentFixture<IndexStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexStoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
