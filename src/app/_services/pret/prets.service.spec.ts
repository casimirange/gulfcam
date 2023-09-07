import { TestBed } from '@angular/core/testing';

import { PretsService } from './prets.service';

describe('PretsService', () => {
  let service: PretsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PretsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
