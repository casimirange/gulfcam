import { TestBed } from '@angular/core/testing';

import { TonineService } from './tontine.service';

describe('TonineService', () => {
  let service: TonineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TonineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
