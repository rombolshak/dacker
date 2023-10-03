import { AccountData } from '@app/models/account.data';
import { AccountFormData } from './account-form.data';
import { Timestamp } from '@angular/fire/firestore';

export class AccountDataConverter {
  public static toModel(formData: AccountFormData): AccountData {
    const result = {} as AccountData;
    result.id = formData.id;
    result.name = formData.name;
    result.bank = formData.bank.id;
    result.openedAt = Timestamp.fromDate(formData.dates.openedDate.toLocalNativeDate());
    result.duration = formData.dates.isOpenEnded ? null : formData.dates.durationDays;
    result.canWithdraw = formData.canWithdraw;
    result.canContribute = formData.canContribute;
    result.interestSchedule = {
      type: formData.interestSchedule.repeatOption!,
      day: formData.interestSchedule.repeatDay,
      isCapitalizing: formData.interestSchedule.isCapitalizing,
    };

    result.interest = [];
    result.interest.push(
      ...formData.interest.monthSteps.map((month, i) => {
        const rates = formData.interest.moneySteps.map((step, j) => {
          return { money: step, rate: formData.interest.rates[i][j] };
        });
        return { month: month, rates: rates };
      }),
    );

    result.interestBase = formData.interestSchedule.basis;
    return result;
  }
}
