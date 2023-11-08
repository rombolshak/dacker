import { TestBed } from '@angular/core/testing';

import { AccountInfoCalculatorProviderService } from './account-info-calculator-provider.service';
import { FakeStorageService } from '@app/data-layer/fake-storage.service';
import { StorageService } from '@app/data-layer/storage.service';

describe('AccountInfoCalculatorService', () => {
  let service: AccountInfoCalculatorProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useClass: FakeStorageService }],
    });
    service = TestBed.inject(AccountInfoCalculatorProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
