import { AccountRequestBuilder } from '@app/data-layer/data.service';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { OperationData } from '@app/models/operation.data';
import { AccountFullData } from '@app/models/account-full.data';
import { AccountData } from '@app/models/account.data';

export class AccountInfoCalculator {
  constructor(accountRequestBuilder: AccountRequestBuilder) {
    this.calculatedData$ = combineLatest([accountRequestBuilder.get(), accountRequestBuilder.operations.getAll()]).pipe(
      filter(data => data[0] !== null),
      map(data => this.calculate(data[0]!, data[1])),
    );
  }

  public calculatedData$: Observable<AccountFullData>;

  private calculate(accountData: AccountData, operations: OperationData[]): AccountFullData {
    return {
      id: accountData.id,
      currentAmount: operations.reduce((total, value) => total + this.getCorrectedAmount(value), 0),
    };
  }
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
