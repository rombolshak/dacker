import { Timestamp } from '@angular/fire/firestore';
import { InterestBase } from '@app/models/account.data';
import { TuiDay } from '@taiga-ui/cdk';

export interface AccountTableData {
  name: string;
  bank: string;
  openedAt: TuiDay;
  duration: number | null;
  closingAt: TuiDay | null;
  canWithdraw: boolean;
  canContribute: boolean;
}
