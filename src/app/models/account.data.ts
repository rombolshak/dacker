import { Identifiable } from '@app/models/identifiable';

type BankInfo = { name: string; icon: string };

type AccountDuration = { days?: number };

type RangeInterest = { rangeStart: number; rangeEnd?: number; rate: number };
type MonthInterest = { startMonth: number; endMonth?: number; steps: RangeInterest[] };
type AccountInterest = MonthInterest[];

type RepeatOption = 'monthly' | 'quaterly' | 'semiannual' | 'annually';
type OneTimeSchedule = { type: 'onClosing' };
type RepeatedSchedule = { type: RepeatOption; day: number };
type InterestSchedule = OneTimeSchedule | RepeatedSchedule;
type InterestBase = 'everyDay' | 'monthlyMin';

export interface AccountData extends Identifiable {
  name: string;
  bank: BankInfo;
  openedAt: Date;
  duration: AccountDuration;
  // interest: AccountInterest;
  // canWithdraw: boolean;
  // canContribute: boolean;
  // interestIsCapitalized: boolean;
  // interestSchedule: InterestSchedule;
  // interestBase: InterestBase;
}
