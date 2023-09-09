import { AccountDataConverter } from './account-data-converter';
import { AccountFormData } from '@app/pages/dashboard/add-account/account-form.data';
import { TuiDay } from '@taiga-ui/cdk';
import { Timestamp } from '@angular/fire/firestore';

describe('AccountDataConverter', () => {
  it('should create an instance', () => {
    expect(new AccountDataConverter()).toBeTruthy();
  });

  it('should convert fill all fields', () => {
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
      capitalization: {
        basis: 'monthlyMin',
        repeatDay: 22,
        repeatOption: 'monthly',
        isEnabled: true,
      },
      canContribute: true,
      canWithdraw: false,
      bank: {
        name: 'test-bank',
        id: 'test-bank-id',
      },
    };

    const result = AccountDataConverter.toModel(formData);
    expect(result.name).toBe('test-name');
    expect(result.id).toBe('test-id');
    expect(result.bank).toBe('test-bank-id');
    expect(result.canContribute).toBe(true);
    expect(result.canWithdraw).toBe(false);
    expect(result.interestBase).toBe('monthlyMin');
    expect(result.interestSchedule.type).toBe('monthly');
    expect(result.interestSchedule.day).toBe(22);
    expect(result.openedAt).toEqual(Timestamp.fromDate(TuiDay.currentLocal().toLocalNativeDate()));
    expect(result.duration).toBe(111);

    expect(result.interest.length).toBe(3);

    expect(result.interest[0].month).toBe(1);
    expect(result.interest[1].month).toBe(4);
    expect(result.interest[2].month).toBe(7);

    expect(result.interest[0].rates.length).toBe(2);
    expect(result.interest[1].rates.length).toBe(2);
    expect(result.interest[2].rates.length).toBe(2);

    expect(result.interest[0].rates[0].money).toBe(10000);
    expect(result.interest[0].rates[1].money).toBe(50000);
    expect(result.interest[1].rates[0].money).toBe(10000);
    expect(result.interest[1].rates[1].money).toBe(50000);
    expect(result.interest[2].rates[0].money).toBe(10000);
    expect(result.interest[2].rates[1].money).toBe(50000);

    expect(result.interest[0].rates[0].rate).toBe(1);
    expect(result.interest[0].rates[1].rate).toBe(2);
    expect(result.interest[1].rates[0].rate).toBe(3);
    expect(result.interest[1].rates[1].rate).toBe(4);
    expect(result.interest[2].rates[0].rate).toBe(5);
    expect(result.interest[2].rates[1].rate).toBe(6);
  });
});
