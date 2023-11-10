import { Identifiable } from '@app/models/identifiable';
import { FirestoreDataConverter, Timestamp } from '@angular/fire/firestore';
import { Money } from '@app/models/money';
import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { TuiDay } from '@taiga-ui/cdk';

export type OperationType = 'contribution' | 'withdrawal' | 'interest' | 'commission';
export type OperationData = OperationData2;
export type OperationDataDto = (OperationData1 | OperationData2) & { date: Timestamp };

export interface OperationData1 extends Identifiable {
  date: Timestamp;
  type: OperationType;
  amount: number;
  memo: string | null;
}

export class OperationData2 implements Identifiable {
  version = '2';
  constructor(
    public readonly id: string,
    public readonly date: TuiDay,
    public readonly type: OperationType,
    public readonly money: Money,
    public readonly memo: string | null,
  ) {}
}

export const operationDataConverter: FirestoreDataConverter<OperationData> = {
  fromFirestore(snapshot: QueryDocumentSnapshot<OperationDataDto>): OperationData {
    const data = snapshot.data();
    if ('version' in data) {
      return new OperationData2(
        data.id,
        TuiDay.fromLocalNativeDate(data.date.toDate()),
        data.type,
        new Money(data.money.amount),
        data.memo,
      );
    }

    return new OperationData2(
      data.id,
      TuiDay.fromLocalNativeDate(data.date.toDate()),
      data.type,
      Money.fromView(data.amount),
      data.memo,
    );
  },
  toFirestore(modelObject: OperationData2): DocumentData {
    return {
      version: modelObject.version,
      id: modelObject.id,
      date: Timestamp.fromDate(modelObject.date.toLocalNativeDate()),
      type: modelObject.type,
      money: {
        amount: modelObject.money.amount,
      },
      memo: modelObject.memo,
    };
  },
};
