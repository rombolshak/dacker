import { AccountRequestBuilder } from '@app/data-layer/data.service';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { OperationData } from '@app/models/operation.data';
import { AccountFullData } from '@app/models/account-full.data';
import { AccountData } from '@app/models/account.data';
import { TuiDay, TuiMonth } from '@taiga-ui/cdk';
import { Money } from '@app/models/money';

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
      currentMoney: operations.reduce((total, value) => total.add(this.getCorrectedAmount(value)), Money.zero),
      receivedProfit: operations.reduce((total, value) => total.add(this.getProfit(value)), Money.zero),
      rate: this.getCurrentRate(accountData, operations),
    };
  }

  private getCorrectedAmount(transaction: OperationData): Money {
    if (this.isNegativeTransaction(transaction)) return transaction.money.toNegative();
    return transaction.money.toPositive();
  }

  private getProfit(transaction: OperationData): Money {
    switch (transaction.type) {
      case 'commission':
      case 'interest':
        return this.getCorrectedAmount(transaction);
      case 'withdrawal':
      case 'contribution':
        return Money.zero;
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
    const openedAt = accountData.openedAt;
    const today = TuiDay.currentLocal();
    const monthDiff = TuiMonth.lengthBetween(openedAt, today);
    const currentPeriodNumber = Math.max(1, today.day <= openedAt.day ? monthDiff : monthDiff + 1);

    const payingDay = accountData.interestSchedule.day ?? openedAt.day;
    const currentPeriodStart =
      payingDay === 31
        ? TuiDay.normalizeOf(today.year, today.month, 1)
        : today.day <= payingDay
        ? TuiDay.normalizeOf(today.year, today.month - 1, payingDay + 1)
        : TuiDay.normalizeOf(today.year, today.month, payingDay + 1);
    const amountAtPeriodStart = operations
      .filter(op => op.date.daySameOrBefore(currentPeriodStart))
      .reduce((total, value) => total.add(this.getCorrectedAmount(value)), Money.zero);

    const currentOperations = [
      ...operations.filter(op => op.date.dayAfter(currentPeriodStart)).sort((a, b) => (a.date < b.date ? -1 : 1)),
      {
        version: '2',
        date: today,
        money: Money.zero,
        type: 'interest',
        id: 'fake',
        memo: null,
      } satisfies OperationData,
    ].reduce(
      (data, op, index, allOps) => {
        const amount =
          index === 0 ? amountAtPeriodStart : data[index - 1].add(this.getCorrectedAmount(allOps[index - 1]));
        return [...data, amount];
      },
      <Money[]>[],
    );

    const minAmount = Math.min(...currentOperations.map(m => m.amount));
    const currentAmount = currentOperations[currentOperations.length - 1].amount;

    const profitableAmount = accountData.interestBase === 'everyDay' ? currentAmount : minAmount;
    const monthRate = accountData.interest
      .sort((a, b) => b.month - a.month)
      .find(mr => mr.month <= currentPeriodNumber)!;
    const amountRate = monthRate.rates
      .sort((a, b) => b.money.amount - a.money.amount)
      .find(ar => ar.money.amount <= profitableAmount)!;
    return amountRate.rate;
  }
}
