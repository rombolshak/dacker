import { ComponentFixture, TestBed } from '@angular/core/testing';

import AccountDetailsComponent from './account-details.component';
import { StorageService } from '@app/data-layer/storage.service';
import { FakeStorageService } from '@app/data-layer/fake-storage.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('AccountDetailsComponent', () => {
  let component: AccountDetailsComponent;
  let fixture: ComponentFixture<AccountDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccountDetailsComponent],
      providers: [
        {
          provide: StorageService,
          useClass: FakeStorageService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'test' }),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(AccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
