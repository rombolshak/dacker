import { TestBed } from '@angular/core/testing';

import { StorageStatusService } from './storage-status.service';

describe('StorageStatusService', () => {
  let service: StorageStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
