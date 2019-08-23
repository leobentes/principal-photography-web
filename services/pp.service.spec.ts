import { TestBed, inject } from '@angular/core/testing';

import { PpService } from './pp.service';

describe('PpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PpService]
    });
  });

  it('should be created', inject([PpService], (service: PpService) => {
    expect(service).toBeTruthy();
  }));
});
