import { Identifiable } from '@app/models/identifiable';
import { Timestamp } from '@angular/fire/firestore';

export type OperationType = 'contribution' | 'withdrawal' | 'interest' | 'commission';
export interface OperationData extends Identifiable {
  date: Timestamp;
  type: OperationType;
  amount: number;
  memo: string;
}
