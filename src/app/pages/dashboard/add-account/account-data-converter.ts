import { AccountData } from '@app/models/account.data';
import { AccountFormData } from '@app/pages/dashboard/add-account/account-form.data';

export class AccountDataConverter {
  public static toModel(formData: AccountFormData): AccountData {
    console.log(formData);
    const result = {} as AccountData;
    result.id = formData.id;
    result.name = formData.name;
    result.bank = formData.bank.id;
    result.openedAt = formData.dates.openedDate.toLocalNativeDate();
    result.duration = formData.dates.isOpenEnded ? null : formData.dates.durationDays;
    result.interest = formData.interest;
    result.canWithdraw = formData.canWithdraw;
    result.canContribute = formData.canContribute;
    result.interestSchedule = formData.capitalization.isEnabled
      ? {
          type: formData.capitalization.repeatOption!,
          day: formData.capitalization.repeatDay,
        }
      : { type: 'onClosing', day: null };

    result.interestBase = formData.capitalization.basis;
    return result;
  }

  public static fromModel(model: AccountData): AccountFormData {
    return {} as AccountFormData;
  }
}
