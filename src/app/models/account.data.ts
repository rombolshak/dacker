import { Timestamp } from '@angular/fire/firestore';
import { AccountData1 } from '@app/models/account/accountData1';
import { AccountData2, MonthInterest2 } from '@app/models/account/accountData2';
export type RepeatOption = 'onClosing' | 'monthly' | 'quaterly' | 'semiannual' | 'annually';
export type InterestBase = 'everyDay' | 'monthlyMin';

export type AccountDataDto = (AccountData1 | AccountData2) & { openedAt: Timestamp };
export type AccountData = AccountData2;
export type MonthInterest = MonthInterest2;
