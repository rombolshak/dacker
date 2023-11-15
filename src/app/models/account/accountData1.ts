import { Identifiable } from '@app/models/identifiable';
import { Timestamp } from '@angular/fire/firestore';
import { InterestBase, RepeatOption } from '@app/models/account.data';

type MoneyStepRate1 = { money: number; rate: number };
type MonthInterest1 = { month: number; rates: MoneyStepRate1[] };
type AccountInterest1 = MonthInterest1[];
type InterestSchedule = { type: RepeatOption; day: number | null; isCapitalizing: boolean };

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
