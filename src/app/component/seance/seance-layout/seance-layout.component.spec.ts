import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeanceLayoutComponent } from './seance-layout.component';

describe('SeanceLayoutComponent', () => {
  let component: SeanceLayoutComponent;
  let fixture: ComponentFixture<SeanceLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeanceLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeanceLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
