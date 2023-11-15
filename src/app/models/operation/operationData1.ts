import { Identifiable } from '@app/models/identifiable';
import { Timestamp } from '@angular/fire/firestore';
import { OperationType } from '@app/models/operation.data';

export interface OperationData1 extends Identifiable {
  date: Timestamp;
  type: OperationType;
  amount: number;
  memo: string | null;
}
