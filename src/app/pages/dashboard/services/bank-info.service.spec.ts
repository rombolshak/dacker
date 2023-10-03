import { TestBed } from '@angular/core/testing';

import { BankInfoService } from './bank-info.service';

describe('BankInfoService', () => {
  let service: BankInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
