import { AccountRequestBuilder } from '@app/data-layer/data.service';
import { map, Observable } from 'rxjs';
import { OperationData } from '@app/models/operation.data';

export class AccountInfoCalculator {
  constructor(accountRequestBuilder: AccountRequestBuilder) {
    this.currentAmount$ = accountRequestBuilder.operations
      .getAll()
      .pipe(map(data => data.reduce((total, value) => total + this.getCorrectedAmount(value), 0)));
  }

  public currentAmount$: Observable<number>;

  private getCorrectedAmount(transaction: OperationData): number {
    switch (transaction.type) {
      case 'commission':
      case 'withdrawal':
        return -Math.abs(transaction.amount);
      case 'interest':
      case 'contribution':
        return Math.abs(transaction.amount);
    }
  }
}
