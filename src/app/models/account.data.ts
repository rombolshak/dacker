import { Identifiable } from '@app/models/identifiable';
type AccountInterest = { moneySteps: number[]; monthSteps: number[]; rates: number[][] };

export type RepeatOption = 'onClosing' | 'monthly' | 'quaterly' | 'semiannual' | 'annually';
type InterestSchedule = { type: RepeatOption; day: number | null };
export type InterestBase = 'everyDay' | 'monthlyMin';

export interface AccountData extends Identifiable {
  name: string;
  bank: string;
  openedAt: Date;
  duration: number | null;
  interest: AccountInterest;
  canWithdraw: boolean;
  canContribute: boolean;
  interestSchedule: InterestSchedule;
  interestBase: InterestBase;
}
