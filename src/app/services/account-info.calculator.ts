import { AccountRequestBuilder } from '@app/data-layer/data.service';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { OperationData } from '@app/models/operation.data';
import { AccountFullData } from '@app/models/account-full.data';
import { AccountData, MonthInterest } from '@app/models/account.data';
import { TuiDay, TuiDayLike, TuiMonth } from '@taiga-ui/cdk';
import { Money } from '@app/models/money';
import { OperationData2 } from '@app/models/operation/operationData2';

export class AccountInfoCalculator {
  constructor(accountRequestBuilder: AccountRequestBuilder) {
    this.calculatedData$ = combineLatest([accountRequestBuilder.get(), accountRequestBuilder.operations.getAll()]).pipe(
      filter(data => data[0] !== null),
      map(data => this.calculate(data[0]!, data[1])),
    );
  }

  public calculatedData$: Observable<AccountFullData>;

  private calculate(accountData: AccountData, operations: OperationData[]): AccountFullData {
    const today = TuiDay.currentLocal();

    const currentMoney = this.getTransactionsResultAt(operations, today);
    const currentRate = this.getRate(accountData, today, currentMoney);

    return {
      accountData: accountData,
      transactions: operations,
      currentMoney: currentMoney,
      receivedProfit: operations.reduce((total, value) => total.add(this.getProfit(value)), Money.zero),
      rate: currentRate,
      futureTransactions: this.getFutureTransactions(accountData, operations),
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

  private getFutureTransactions(accountData: AccountData, operations: OperationData[]): OperationData[] {
    const lastPaymentDay = this.getLastPaymentDay(accountData, operations),
      paymentDays = this.getNextPaymentDays(accountData, lastPaymentDay),
      futureTransactions = [];

    for (let i = 0; i < paymentDays.length; i++) {
      const last = i === 0 ? lastPaymentDay : paymentDays[i - 1];
      const next = paymentDays[i];
      const money = this.getTransactionsResultAt([...operations, ...futureTransactions], last);
      const profit = this.getPeriodProfit(accountData, operations, last, next, money);
      futureTransactions.push(new OperationData2('', next, 'interest', profit, null));
    }

    return futureTransactions;
  }

  private getPeriodProfit(
    accountData: AccountData,
    operations: OperationData[],
    lastPaymentDay: TuiDay,
    nextPaymentDay: TuiDay,
    moneyAtPeriodStart: Money,
  ): Money {
    const periodOperations = operations.filter(
      t => t.date.dayAfter(lastPaymentDay) && t.date.dayBefore(nextPaymentDay),
    );
    periodOperations.push(new OperationData2('fake', nextPaymentDay, 'interest', Money.zero, ''));
    const profitableAmounts = periodOperations.reduce(
      (result, current, index, allOps) => {
        const prevAmount =
          index === 0 ? moneyAtPeriodStart : result[index - 1].money.add(this.getCorrectedAmount(allOps[index - 1]));
        const duration = TuiDay.lengthBetween(index === 0 ? lastPaymentDay : allOps[index - 1].date, current.date);
        return [...result, { money: prevAmount, duration: duration }];
      },
      <{ money: Money; duration: number }[]>[],
    );
    if (accountData.interestBase === 'monthlyMin') {
      const minAmount = new Money(Math.min(...profitableAmounts.map(pa => pa.money.amount)));
      const rate = this.getRate(accountData, nextPaymentDay, minAmount);
      return minAmount.getProfit(rate, TuiDay.lengthBetween(lastPaymentDay, nextPaymentDay));
    } else {
      return profitableAmounts.reduce((total, current) => {
        const rate = this.getRate(accountData, nextPaymentDay, current.money);
        return total.add(current.money.getProfit(rate, current.duration));
      }, Money.zero);
    }
  }

  private getRate(account: AccountData, day: TuiDay, amount: Money): number {
    return this.getAmountRate(this.getPeriodInterest(account, day), amount);
  }

  private getPeriodInterest(account: AccountData, day: TuiDay): MonthInterest {
    const openedAt = account.openedAt;
    const monthDiff = TuiMonth.lengthBetween(openedAt, day);
    const periodNumber = Math.max(1, day.day <= openedAt.day ? monthDiff : monthDiff + 1);
    return [...account.interest].reverse().find(mi => mi.month <= periodNumber)!;
  }

  private getAmountRate(interest: MonthInterest, amount: Money): number {
    if (amount.amount === 0) return 0;

    const maxRateIndex =
      interest.rates.length - 1 - [...interest.rates].reverse().findIndex(msr => msr.money <= amount)!;
    let total = 0;
    for (let i = 1; i <= maxRateIndex; i++) {
      const msr = interest.rates[i - 1];
      total += (interest.rates[i].money.amount - msr.money.amount) * msr.rate;
    }

    const msr = interest.rates[maxRateIndex];
    total += (amount.amount - msr.money.amount) * msr.rate;
    return total / amount.amount;
  }

  private getNextPaymentDays(account: AccountData, afterDay: TuiDay): TuiDay[] {
    const closingDate = account.duration !== null ? account.openedAt.append({ day: account.duration }) : null;
    if (account.interestSchedule.type === 'onClosing') {
      return [closingDate!];
    }

    const period = this.getInterestPeriodDuration(account);
    const result = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (closingDate === null && result.length === 3) break;
      const nextPayment = afterDay.append(period);
      if (closingDate !== null && nextPayment.dayAfter(closingDate)) break;
      result.push(nextPayment);
      afterDay = nextPayment;
    }

    return result;
  }

  private getLastPaymentDay(account: AccountData, operations: OperationData[]): TuiDay {
    if (account.interestSchedule.type === 'onClosing') {
      return account.openedAt;
    }

    return [...operations].reverse().find(t => t.type === 'interest')?.date ?? account.openedAt;
  }

  private getInterestPeriodDuration(account: AccountData): TuiDayLike {
    switch (account.interestSchedule.type) {
      case 'onClosing':
        throw new Error('dont call getInterestPeriodDuration for non-periodical accounts');
      case 'monthly':
        return { month: 1 };
      case 'quaterly':
        return { month: 3 };
      case 'semiannual':
        return { month: 6 };
      case 'annually':
        return { year: 1 };
    }
  }

  private getTransactionsResultAt(transactions: readonly OperationData[], date: TuiDay): Money {
    return transactions
      .filter(t => t.date.daySameOrBefore(date))
      .reduce((total, current) => total.add(this.getCorrectedAmount(current)), Money.zero);
  }
}
