import { AccountRequestBuilder } from '@app/data-layer/data.service';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { OperationData } from '@app/models/operation.data';
import { AccountFullData } from '@app/models/account-full.data';
import { AccountData } from '@app/models/account.data';
import { TuiDay, TuiMonth } from '@taiga-ui/cdk';
import { Timestamp } from '@angular/fire/firestore';

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
      receivedProfit: operations.reduce((total, value) => total + this.getProfit(value), 0),
      rate: this.getCurrentRate(accountData, operations),
    };
  }

  private getCorrectedAmount(transaction: OperationData): number {
    if (this.isNegativeTransaction(transaction)) return -Math.abs(transaction.amount);

    return Math.abs(transaction.amount);
  }

  private getProfit(transaction: OperationData): number {
    switch (transaction.type) {
      case 'commission':
      case 'interest':
        return this.getCorrectedAmount(transaction);
      case 'withdrawal':
      case 'contribution':
        return 0;
    }
  }

  private isNegativeTransaction(transaction: OperationData): boolean {
    switch (transaction.type) {
      case 'commission':
      case 'withdrawal':
        return true;
      case 'interest':
      case 'contribution':
        return false;
    }
  }

  private getCurrentRate(accountData: AccountData, operations: OperationData[]): number {
    const openedAt = TuiDay.fromLocalNativeDate(accountData.openedAt.toDate());
    const today = TuiDay.currentLocal();
    const monthDiff = TuiMonth.lengthBetween(openedAt, today);
    const currentPeriodNumber = today.day <= openedAt.day ? monthDiff : monthDiff + 1;

    const payingDay = accountData.interestSchedule.day ?? openedAt.day;
    const currentPeriodStart =
      payingDay === 31
        ? TuiDay.normalizeOf(today.year, today.month, 1)
        : today.day <= payingDay
        ? TuiDay.normalizeOf(today.year, today.month - 1, payingDay + 1)
        : TuiDay.normalizeOf(today.year, today.month, payingDay + 1);
    const amountAtPeriodStart = operations
      .filter(op => TuiDay.fromLocalNativeDate(op.date.toDate()).daySameOrBefore(currentPeriodStart))
      .reduce((total, value) => total + this.getCorrectedAmount(value), 0);

    const currentOperations = [
      ...operations
        .filter(op => TuiDay.fromLocalNativeDate(op.date.toDate()).dayAfter(currentPeriodStart))
        .sort((a, b) => (a.date < b.date ? -1 : 1)),
      {
        date: Timestamp.fromDate(new Date()),
        amount: 0,
        type: 'interest',
        id: 'fake',
        memo: null,
      } satisfies OperationData,
    ].reduce(
      (data, op, index, allOps) => {
        const duration = TuiDay.lengthBetween(
          index === 0 ? currentPeriodStart : TuiDay.fromLocalNativeDate(allOps[index - 1].date.toDate()),
          TuiDay.fromLocalNativeDate(op.date.toDate()),
        );
        const amount =
          index === 0 ? amountAtPeriodStart : data[0][index - 1] + this.getCorrectedAmount(allOps[index - 1]);
        return [
          [...data[0], amount],
          [...data[1], duration],
        ];
      },
      [<number[]>[], <number[]>[]],
    );

    const minAmount = Math.min(...currentOperations[0]);
    const average =
      currentOperations[0].reduce((total, amount, index) => total + amount * currentOperations[1][index], 0) /
      currentOperations[1].reduce((total, duration) => total + duration, 0);

    const profitableAmount = accountData.interestBase === 'everyDay' ? average : minAmount;
    const monthRate = accountData.interest.reverse().find(mr => mr.month <= currentPeriodNumber)!;
    const amountRate = monthRate.rates.reverse().find(ar => ar.money <= profitableAmount)!;
    return amountRate.rate;
  }
}
