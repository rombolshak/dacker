import { AccountData } from '@app/models/account.data';
import { AccountFormData } from '@app/pages/dashboard/add-account/account-form.data';

export class AccountDataConverter {
  public static toModel(formData: AccountFormData): AccountData {
    const result = {} as AccountData;
    result.id = formData.id;
    result.name = formData.name;
    result.bank = formData.bank.id;
    result.openedAt = formData.dates.openedDate.toLocalNativeDate();
    result.duration = formData.dates.isOpenEnded ? null : formData.dates.durationDays;
    result.canWithdraw = formData.canWithdraw;
    result.canContribute = formData.canContribute;
    result.interestSchedule = formData.capitalization.isEnabled
      ? {
          type: formData.capitalization.repeatOption!,
          day: formData.capitalization.repeatDay,
        }
      : { type: 'onClosing', day: null };

    result.interest = [];
    result.interest.push(
      ...formData.interest.monthSteps.map((month, i) => {
        const rates = formData.interest.moneySteps.map((step, j) => {
          return { money: step, rate: formData.interest.rates[i][j] };
        });
        return { month: month, rates: rates };
      })
    );

    result.interestBase = formData.capitalization.basis;
    return result;
  }
}
