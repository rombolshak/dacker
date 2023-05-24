import { Identifiable } from '@app/models/identifiable';

type BankInfo = { name: string; icon: string };

type AccountDuration = { days?: number };

type RangeInterest = { rangeStart: number; rangeEnd?: number; rate: number };
type MonthInterest = { startMonth: number; endMonth?: number; steps: RangeInterest[] };
type AccountInterest = MonthInterest[];

type InterestSchedule = 'onClosing' | 'endOfMonth' | 'monthly' | 'quaterly' | 'semiannual' | 'annually';
type InterestBase = 'everyDay' | 'monthlyMin' | 'monthlyAvg';

export interface AccountData extends Identifiable {
  name: string;
  bank: BankInfo;
  openedAt: Date;
  duration: AccountDuration;
  interest: AccountInterest;
  canWithdraw: boolean;
  canContribute: boolean;
  interestIsCapitalized: boolean;
  interestSchedule: InterestSchedule;
  interestBase: InterestBase;
}
