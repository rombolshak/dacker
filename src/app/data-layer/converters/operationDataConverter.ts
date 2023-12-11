import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, Timestamp } from '@angular/fire/firestore';
import { TuiDay } from '@taiga-ui/cdk';
import { Money } from '@app/models/money';
import { OperationData, OperationDataDto, OperationType } from '@app/models/operation.data';
import { OperationData2 } from '@app/models/operation/operationData2';

function createMoney(amount: number, operationType: OperationType, v1: boolean = false): Money {
  if (amount < 0) amount = -amount;
  switch (operationType) {
    case 'contribution':
    case 'interest':
      return v1 ? Money.fromView(amount) : new Money(amount);
    case 'withdrawal':
    case 'commission':
      return v1 ? Money.fromView(-amount) : new Money(-amount);
  }
}

export const operationDataConverter: FirestoreDataConverter<OperationData> = {
  fromFirestore(snapshot: QueryDocumentSnapshot<OperationDataDto>): OperationData {
    const data = snapshot.data();
    if ('version' in data) {
      return new OperationData2(
        data.id,
        TuiDay.fromLocalNativeDate(data.date.toDate()),
        data.type,
        createMoney(data.money.amount, data.type),
        data.memo,
      );
    }

    return new OperationData2(
      data.id,
      TuiDay.fromLocalNativeDate(data.date.toDate()),
      data.type,
      createMoney(data.amount, data.type, true),
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
        amount: modelObject.money.toPositive().amount,
      },
      memo: modelObject.memo,
    };
  },
};
