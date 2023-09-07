import { TestBed } from '@angular/core/testing';

import { AmandeService } from './amande.service';

describe('AmandeService', () => {
  let service: AmandeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmandeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
