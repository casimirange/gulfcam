import { TestBed } from '@angular/core/testing';

import { MangwaService } from './mangwa.service';

describe('MangwaService', () => {
  let service: MangwaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MangwaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
