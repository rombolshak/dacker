import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, Timestamp } from '@angular/fire/firestore';
import { Money } from '@app/models/money';
import { TuiDay } from '@taiga-ui/cdk';
import { AccountData, AccountDataDto } from '@app/models/account.data';
import { AccountData2 } from '@app/models/account/accountData2';

export const accountDataConverter: FirestoreDataConverter<AccountData> = {
  fromFirestore(snapshot: QueryDocumentSnapshot<AccountDataDto>): AccountData {
    const data = snapshot.data();
    if ('version' in data) {
      const interest = data.interest
        .map(mi => {
          return {
            month: mi.month,
            rates: mi.rates
              .map(msr => {
                return { rate: msr.rate, money: new Money(msr.money.amount) };
              })
              .sort((a, b) => a.money.amount - b.money.amount),
          };
        })
        .sort((a, b) => {
          return a.month - b.month;
        });
      return new AccountData2(
        data.id,
        data.name,
        data.bank,
        TuiDay.fromLocalNativeDate(data.openedAt.toDate()),
        data.duration,
        interest,
        data.canWithdraw,
        data.canContribute,
        data.interestSchedule,
        data.interestBase,
      );
    }

    return new AccountData2(
      data.id,
      data.name,
      data.bank,
      TuiDay.fromLocalNativeDate(data.openedAt.toDate()),
      data.duration,
      data.interest
        .map(mi => {
          return {
            month: mi.month,
            rates: mi.rates
              .map(msr => {
                return { rate: msr.rate, money: Money.fromView(msr.money) };
              })
              .sort((a, b) => a.money.amount - b.money.amount),
          };
        })
        .sort((a, b) => a.month - b.month),
      data.canWithdraw,
      data.canContribute,
      data.interestSchedule,
      data.interestBase,
    );
  },
  toFirestore(modelObject: AccountData): DocumentData {
    return {
      version: modelObject.version,
      id: modelObject.id,
      name: modelObject.name,
      bank: modelObject.bank,
      openedAt: Timestamp.fromDate((modelObject.openedAt as TuiDay).toLocalNativeDate()),
      duration: modelObject.duration,
      interest: modelObject.interest.map(mi => {
        return {
          month: mi.month,
          rates: mi.rates.map(msr => {
            return {
              money: {
                amount: msr.money.amount,
              },
              rate: msr.rate,
            };
          }),
        };
      }),
      canWithdraw: modelObject.canWithdraw,
      canContribute: modelObject.canContribute,
      interestSchedule: modelObject.interestSchedule,
      interestBase: modelObject.interestBase,
    };
  },
};
