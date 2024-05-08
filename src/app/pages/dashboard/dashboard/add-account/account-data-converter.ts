import { AccountData } from '@app/models/account.data';
import { AccountFormData } from './account-form.data';
import { Injectable } from '@angular/core';
import { BankInfoService } from '@app/pages/dashboard/services/bank-info.service';
import { Money } from '@app/models/money';
import { firestoreAutoId } from '@app/models/identifiable';
import { AccountData2 } from '@app/models/account/accountData2';

@Injectable({
  providedIn: 'root',
})
export class AccountDataConverter {
  constructor(private readonly banks: BankInfoService) {}
  public toModel(formData: AccountFormData): AccountData {
    const id = formData.id === '' ? firestoreAutoId() : formData.id;
    return new AccountData2(
      id,
      formData.name,
      formData.bank.id,
      formData.dates.openedDate,
      formData.dates.isOpenEnded ? null : formData.dates.durationDays,
      formData.interest.monthSteps.map((month, i) => {
        const rates = formData.interest.moneySteps.map((step, j) => {
          return { money: Money.fromView(step), rate: formData.interest.rates[i][j] };
        });
        return { month: month, rates: rates };
      }),
      formData.canWithdraw,
      formData.canContribute,
      {
        type: formData.interestSchedule.repeatOption!,
        day: formData.interestSchedule.repeatDay,
        isCapitalizing: formData.interestSchedule.isCapitalizing,
      },
      formData.interestSchedule.basis,
      formData.isClosed,
    );
  }

  public fromModel(model: AccountData): AccountFormData {
    return {
      id: model.id,
      name: model.name,
      bank: this.banks.findById(model.bank)!,
      dates: {
        openedDate: model.openedAt,
        isOpenEnded: model.duration === null,
        durationDays: model.duration,
        closingDate: model.duration === null ? null : model.openedAt.append({ day: model.duration }),
      },
      canWithdraw: model.canWithdraw,
      canContribute: model.canContribute,
      interestSchedule: {
        isCapitalizing: model.interestSchedule.isCapitalizing,
        basis: model.interestBase,
        repeatOption: model.interestSchedule.type,
        repeatDay: model.interestSchedule.day,
      },
      interest: {
        moneySteps: model.interest[0].rates.map(r => r.money.toView()),
        monthSteps: model.interest.map(m => m.month),
        rates: model.interest.map(m => m.rates.map(r => r.rate)),
      },
      isClosed: model.isClosed,
    } satisfies AccountFormData;
  }
}
