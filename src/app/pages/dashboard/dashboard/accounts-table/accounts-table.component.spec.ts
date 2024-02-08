import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsTableComponent } from './accounts-table.component';
import { StorageService } from '@app/data-layer/storage.service';
import { FakeStorageService } from '@app/data-layer/fake-storage.service';

describe('AccountsTableComponent', () => {
  let component: AccountsTableComponent;
  let fixture: ComponentFixture<AccountsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsTableComponent],
      providers: [
        {
          provide: StorageService,
          useClass: FakeStorageService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
