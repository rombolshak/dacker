import { Timestamp } from '@angular/fire/firestore';
import { InterestBase } from '@app/models/account.data';

export interface AccountTableData {
  name: string;
  bank: string;
  openedAt: Date;
  duration: number | null;
  closingAt: Date | null;
}
