import { Identifiable } from '@app/models/identifiable';
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, Timestamp } from '@angular/fire/firestore';
import { TuiDay } from '@taiga-ui/cdk';
import { Money } from '@app/models/money';

export type RepeatOption = 'onClosing' | 'monthly' | 'quaterly' | 'semiannual' | 'annually';
export type InterestBase = 'everyDay' | 'monthlyMin';

type MoneyStepRate1 = { money: number; rate: number };
type MoneyStepRate2 = { money: Money; rate: number };
type MonthInterest1 = { month: number; rates: MoneyStepRate1[] };
type MonthInterest2 = { month: number; rates: MoneyStepRate2[] };
type AccountInterest1 = MonthInterest1[];
type AccountInterest2 = MonthInterest2[];
type InterestSchedule = { type: RepeatOption; day: number | null; isCapitalizing: boolean };

export type AccountDataDto = (AccountData1 | AccountData2) & { openedAt: Timestamp };
export type AccountData = AccountData2;
export interface AccountData1 extends Identifiable {
  name: string;
  bank: string;
  openedAt: Timestamp;
  duration: number | null;
  interest: AccountInterest1;
  canWithdraw: boolean;
  canContribute: boolean;
  interestSchedule: InterestSchedule;
  interestBase: InterestBase;
}

export class AccountData2 implements Identifiable {
  version = '2';
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly bank: string,
    public readonly openedAt: TuiDay,
    public readonly duration: number | null,
    public readonly interest: AccountInterest2,
    public readonly canWithdraw: boolean,
    public readonly canContribute: boolean,
    public readonly interestSchedule: InterestSchedule,
    public readonly interestBase: InterestBase,
  ) {}
}

export const accountDataConverter: FirestoreDataConverter<AccountData> = {
  fromFirestore(snapshot: QueryDocumentSnapshot<AccountDataDto>): AccountData {
    const data = snapshot.data();
    if ('version' in data) {
      return new AccountData2(
        data.id,
        data.name,
        data.bank,
        TuiDay.fromLocalNativeDate(data.openedAt.toDate()),
        data.duration,
        data.interest.map(mi => {
          return {
            month: mi.month,
            rates: mi.rates.map(msr => {
              return { rate: msr.rate, money: new Money(msr.money.amount) };
            }),
          };
        }),
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
      data.interest.map(mi => {
        return {
          month: mi.month,
          rates: mi.rates.map(msr => {
            return { rate: msr.rate, money: Money.fromView(msr.money) };
          }),
        };
      }),
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
