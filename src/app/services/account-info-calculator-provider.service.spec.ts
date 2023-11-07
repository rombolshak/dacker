import { TestBed } from '@angular/core/testing';

import { AccountInfoCalculatorProviderService } from './account-info-calculator-provider.service';

describe('AccountInfoCalculatorService', () => {
  let service: AccountInfoCalculatorProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountInfoCalculatorProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
