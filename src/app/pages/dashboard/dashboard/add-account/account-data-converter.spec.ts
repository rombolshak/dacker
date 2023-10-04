import { AccountDataConverter } from './account-data-converter';
import { AccountFormData } from './account-form.data';
import { TuiDay } from '@taiga-ui/cdk';
import { Timestamp } from '@angular/fire/firestore';
import { TestBed } from '@angular/core/testing';
import { AccountData } from '@app/models/account.data';
import { BankInfoService } from '@app/pages/dashboard/services/bank-info.service';

describe('AccountDataConverter', () => {
  let service: AccountDataConverter;

  const formData: AccountFormData = {
    name: 'test-name',
    id: 'test-id',
    dates: {
      openedDate: TuiDay.currentLocal(),
      closingDate: TuiDay.currentLocal().append({ day: 111 }),
      durationDays: 111,
      isOpenEnded: false,
    },
    interest: {
      monthSteps: [1, 4, 7],
      moneySteps: [10000, 50000],
      rates: [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
    },
    interestSchedule: {
      basis: 'monthlyMin',
      repeatDay: 22,
      repeatOption: 'monthly',
      isCapitalizing: true,
    },
    canContribute: true,
    canWithdraw: false,
    bank: {
      name: 'test-bank',
      id: 'test-bank-id',
    },
  };

  const modelData: AccountData = {
    name: 'test-name',
    id: 'test-id',
    bank: 'test-bank-id',
    canContribute: true,
    canWithdraw: false,
    interestBase: 'monthlyMin',
    interestSchedule: {
      type: 'monthly',
      day: 22,
      isCapitalizing: true,
    },
    openedAt: Timestamp.fromDate(TuiDay.currentLocal().toLocalNativeDate()),
    duration: 111,
    interest: [
      {
        month: 1,
        rates: [
          {
            money: 10000,
            rate: 1,
          },
          {
            money: 50000,
            rate: 2,
          },
        ],
      },
      {
        month: 4,
        rates: [
          {
            money: 10000,
            rate: 3,
          },
          {
            money: 50000,
            rate: 4,
          },
        ],
      },
      {
        month: 7,
        rates: [
          {
            money: 10000,
            rate: 5,
          },
          {
            money: 50000,
            rate: 6,
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BankInfoService,
          useClass: BankInfoService,
        },
      ],
    });
    service = TestBed.inject(AccountDataConverter);
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('should convert fill all fields', () => {
    const result = service.toModel(formData);
    expect(result).toEqual(modelData);
  });

  it('should convert model to form', () => {
    const result = service.fromModel(modelData);
    expect(result).toEqual(formData);
  });
});
