import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiAxesModule, TuiBarChartModule } from '@taiga-ui/addon-charts';
import { AccountFullData } from '@app/models/account-full.data';
import { TuiContextWithImplicit, TuiMonth } from '@taiga-ui/cdk';
import { Money } from '@app/models/money';
import { OperationData, OperationType } from '@app/models/operation.data';
import { tuiFormatNumber, TuiHintModule } from '@taiga-ui/core';
import { TuiCurrency, tuiFormatCurrency } from '@taiga-ui/addon-commerce';

@Component({
  selector: 'monitraks-balance-chart',
  standalone: true,
  imports: [CommonModule, TuiAxesModule, TuiBarChartModule, TuiHintModule],
  templateUrl: './balance-chart.component.html',
  styleUrls: ['./balance-chart.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceChartComponent {
  @Input()
  public set accountInfo(data: AccountFullData | null) {
    if (data === null || (data.transactions.length === 0 && data.futureTransactions.length === 0)) {
      this.setNoData();
      return;
    }

    const dataPoints: readonly number[][] = [[], [], [], []];
    const monthLabels = [];
    const firstMonth = data.accountData.openedAt;
    const lastMonth =
      data.futureTransactions.length !== 0
        ? data.futureTransactions[data.futureTransactions.length - 1].date
        : data.transactions[data.transactions.length - 1].date;
    let runningBalance = Money.zero;
    let minBalance = Number.MAX_VALUE;
    let maxBalance = 0;
    for (let month = firstMonth as TuiMonth; month.monthSameOrBefore(lastMonth); month = month.append({ month: 1 })) {
      monthLabels.push(`${month.formattedMonthPart} / ${month.formattedYear.substring(2)}`);

      const pastOps = data.transactions.filter(op => op.date.monthSame(month));
      const futureOps = data.futureTransactions.filter(op => op.date.monthSame(month));
      const balanceChange = this.sumByType(pastOps, ['contribution', 'withdrawal']);
      const percentChange = this.sumByType(pastOps, ['interest', 'commission']);
      const futureBalanceChange = this.sumByType(futureOps, ['contribution', 'withdrawal']);
      const futurePercentChange = this.sumByType(futureOps, ['interest', 'commission']);
      runningBalance = runningBalance.add(balanceChange).add(futureBalanceChange);

      if (balanceChange.amount !== 0 || percentChange.amount !== 0) {
        dataPoints[0].push(runningBalance.toView());
        dataPoints[1].push(percentChange.toView());
        dataPoints[2].push(0);
        dataPoints[3].push(futurePercentChange.toView());
      } else {
        dataPoints[0].push(0);
        dataPoints[1].push(0);
        dataPoints[2].push(runningBalance.toView());
        dataPoints[3].push(futurePercentChange.toView());
      }

      const total = runningBalance.toView() + percentChange.toView() + futurePercentChange.toView();
      if (total > maxBalance) maxBalance = total;
      if (runningBalance.toView() < minBalance) minBalance = runningBalance.toView();

      if (data.accountData.interestSchedule.isCapitalizing) {
        runningBalance = runningBalance.add(percentChange).add(futurePercentChange);
      }
    }

    const step = (maxBalance - minBalance) / dataPoints[0].length;
    this.correction = minBalance - 3 * step;

    dataPoints[0].forEach((value, index, array) => {
      if (value !== 0) array[index] = value - this.correction;
    });
    dataPoints[2].forEach((value, index, array) => {
      if (value !== 0) array[index] = value - this.correction;
    });

    this.yAxesLabels = [
      ...Array(2).fill(''),
      tuiFormatNumber(minBalance),
      ...new Array(dataPoints[0].length - 4).fill(''),
      tuiFormatNumber(maxBalance),
    ];

    this.xAxesLabels = monthLabels;
    this.data = dataPoints;
  }

  public xAxesLabels: string[] = [];
  public yAxesLabels: string[] = [];
  public data: ReadonlyArray<readonly number[]> = [];

  readonly hint = ({ $implicit }: TuiContextWithImplicit<number>): string => {
    let result = '';
    if (this.data[0][$implicit] !== 0) {
      result += `Баланс: ${tuiFormatNumber(this.correction + this.data[0][$implicit])}${tuiFormatCurrency(
        TuiCurrency.Ruble,
      )}\n`;
    }
    if (this.data[1][$implicit] !== 0) {
      result += `Начисленные проценты: ${tuiFormatNumber(this.data[1][$implicit])}${tuiFormatCurrency(
        TuiCurrency.Ruble,
      )}\n`;
    }
    if (this.data[2][$implicit] !== 0) {
      result += `Баланс: ${tuiFormatNumber(this.correction + this.data[2][$implicit])}${tuiFormatCurrency(
        TuiCurrency.Ruble,
      )}\n`;
    }
    if (this.data[3][$implicit] !== 0) {
      result += `Прогнозируемые проценты: ${tuiFormatNumber(this.data[3][$implicit])}${tuiFormatCurrency(
        TuiCurrency.Ruble,
      )}`;
    }

    return result;
  };

  private setNoData(): void {
    this.xAxesLabels = [];
    this.yAxesLabels = [];
  }

  private sumByType(ops: OperationData[], types: OperationType[]) {
    return ops
      .filter(op => types.includes(op.type))
      .map(op => op.money)
      .reduce((total, current) => total.add(current), Money.zero);
  }

  private correction: number = 0;
}
