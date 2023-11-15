import { Timestamp } from '@angular/fire/firestore';
import { OperationData1 } from '@app/models/operation/operationData1';
import { OperationData2 } from '@app/models/operation/operationData2';

export type OperationType = 'contribution' | 'withdrawal' | 'interest' | 'commission';
export type OperationData = OperationData2;
export type OperationDataDto = (OperationData1 | OperationData2) & { date: Timestamp };
