import { TuiDay } from '@taiga-ui/cdk';
import { InterestBase, RepeatOption } from '@app/models/account.data';

export interface AccountFormData {
  id: string;
  name: string;
  bank: { name: string; id: string };
  dates: {
    openedDate: TuiDay;
    isOpenEnded: boolean;
    closingDate: TuiDay | null;
    durationDays: number | null;
  };
  interest: {
    monthSteps: number[];
    moneySteps: number[];
    rates: number[][];
  };
  canWithdraw: boolean;
  canContribute: boolean;
  capitalization: {
    isEnabled: boolean;
    repeatOption: RepeatOption | null;
    repeatDay: number | null;
    basis: InterestBase;
  };
}
