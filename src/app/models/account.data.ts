import { Identifiable } from '@app/models/identifiable';
import { Timestamp } from '@angular/fire/firestore';

export type RepeatOption = 'onClosing' | 'monthly' | 'quaterly' | 'semiannual' | 'annually';
export type InterestBase = 'everyDay' | 'monthlyMin';

type MoneyStepRate = { money: number; rate: number };
type MonthInterest = { month: number; rates: MoneyStepRate[] };
type AccountInterest = MonthInterest[];
type InterestSchedule = { type: RepeatOption; day: number | null };

export interface AccountData extends Identifiable {
  name: string;
  bank: string;
  openedAt: Timestamp;
  duration: number | null;
  interest: AccountInterest;
  canWithdraw: boolean;
  canContribute: boolean;
  interestSchedule: InterestSchedule;
  interestBase: InterestBase;
}
