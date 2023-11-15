import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, Timestamp } from '@angular/fire/firestore';
import { TuiDay } from '@taiga-ui/cdk';
import { Money } from '@app/models/money';
import { OperationData, OperationDataDto } from '@app/models/operation.data';
import { OperationData2 } from '@app/models/operation/operationData2';

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
