import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';
import { StorageService } from '@app/data-layer/storage.service';
import { FakeStorageService } from '@app/data-layer/fake-storage.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: StorageService,
          useClass: FakeStorageService,
        },
      ],
    });
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
