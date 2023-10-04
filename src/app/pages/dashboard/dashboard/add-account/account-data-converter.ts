import { AccountData } from '@app/models/account.data';
import { AccountFormData } from './account-form.data';
import { Timestamp } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { BankInfoService } from '@app/pages/dashboard/services/bank-info.service';
import { TuiDay } from '@taiga-ui/cdk';

@Injectable({
  providedIn: 'root',
})
export class AccountDataConverter {
  constructor(private readonly banks: BankInfoService) {}
  public toModel(formData: AccountFormData): AccountData {
    return {
      id: formData.id,
      name: formData.name,
      bank: formData.bank.id,
      openedAt: Timestamp.fromDate(formData.dates.openedDate.toLocalNativeDate()),
      duration: formData.dates.isOpenEnded ? null : formData.dates.durationDays,
      canWithdraw: formData.canWithdraw,
      canContribute: formData.canContribute,
      interestSchedule: {
        type: formData.interestSchedule.repeatOption!,
        day: formData.interestSchedule.repeatDay,
        isCapitalizing: formData.interestSchedule.isCapitalizing,
      },

      interest: formData.interest.monthSteps.map((month, i) => {
        const rates = formData.interest.moneySteps.map((step, j) => {
          return { money: step, rate: formData.interest.rates[i][j] };
        });
        return { month: month, rates: rates };
      }),

      interestBase: formData.interestSchedule.basis,
    } satisfies AccountData;
  }

  public fromModel(model: AccountData): AccountFormData {
    return {
      id: model.id,
      name: model.name,
      bank: this.banks.findById(model.bank)!,
      dates: {
        openedDate: TuiDay.fromLocalNativeDate(model.openedAt.toDate()),
        isOpenEnded: model.duration === null,
        durationDays: model.duration,
        closingDate:
          model.duration === null
            ? null
            : TuiDay.fromLocalNativeDate(model.openedAt.toDate()).append({ day: model.duration }),
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
        moneySteps: model.interest[0].rates.map(r => r.money),
        monthSteps: model.interest.map(m => m.month),
        rates: model.interest.map(m => m.rates.map(r => r.rate)),
      },
    } satisfies AccountFormData;
  }
}
