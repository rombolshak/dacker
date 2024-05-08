import { AccountDataConverter } from './account-data-converter';
import { AccountFormData } from './account-form.data';
import { TuiDay } from '@taiga-ui/cdk';
import { TestBed } from '@angular/core/testing';
import { AccountData } from '@app/models/account.data';
import { BankInfoService } from '@app/pages/dashboard/services/bank-info.service';
import { BankInfo } from '@app/pages/dashboard/services/bank-info';
import { Money } from '@app/models/money';
import { AccountData2 } from '@app/models/account/accountData2';

class FakeBankInfoService {
  public findById(id: string): BankInfo | null {
    if (id === 'test-bank-id') return { name: 'test-bank', id: id };
    return null;
  }
}

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
    isClosed: false,
  };

  const modelData: AccountData = new AccountData2(
    'test-id',
    'test-name',
    'test-bank-id',
    TuiDay.currentLocal(),
    111,
    [
      {
        month: 1,
        rates: [
          {
            money: Money.fromView(10000),
            rate: 1,
          },
          {
            money: Money.fromView(50000),
            rate: 2,
          },
        ],
      },
      {
        month: 4,
        rates: [
          {
            money: Money.fromView(10000),
            rate: 3,
          },
          {
            money: Money.fromView(50000),
            rate: 4,
          },
        ],
      },
      {
        month: 7,
        rates: [
          {
            money: Money.fromView(10000),
            rate: 5,
          },
          {
            money: Money.fromView(50000),
            rate: 6,
          },
        ],
      },
    ],
    false,
    true,
    {
      type: 'monthly',
      day: 22,
      isCapitalizing: true,
    },
    'monthlyMin',
    false,
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BankInfoService,
          useClass: FakeBankInfoService,
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
    console.log(result);
    console.log(modelData);
    expect(result).toEqual(modelData);
  });

  it('should convert model to form', () => {
    const result = service.fromModel(modelData);
    expect(result).toEqual(formData);
  });
});
