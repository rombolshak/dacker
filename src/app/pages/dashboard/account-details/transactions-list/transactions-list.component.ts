import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionViewModel } from '@app/pages/dashboard/account-details/transaction.view-model';
import { operationTypeStringify } from '../localization.helper';
import { TuiHintModule, TuiLinkModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiMoneyModule } from '@taiga-ui/addon-commerce';
import { MoneyAmountPipe } from '@app/pipes/money-amount.pipe';
import { TuiDay, TuiLetModule } from '@taiga-ui/cdk';
import { TuiElasticContainerModule } from '@taiga-ui/kit';

@Component({
  selector: 'monitraks-transactions-list',
  standalone: true,
  imports: [
    CommonModule,
    TuiSvgModule,
    TuiMoneyModule,
    TuiHintModule,
    MoneyAmountPipe,
    TuiLetModule,
    TuiElasticContainerModule,
    TuiLinkModule,
  ],
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsListComponent {
  @Input()
  public transactions: TransactionViewModel[] | null = null;

  @Input()
  public futureTransactions: TransactionViewModel[] | null = null;

  @Output()
  public edit = new EventEmitter<TransactionViewModel>();

  @Output()
  public remove = new EventEmitter<TransactionViewModel>();

  @Output()
  public approve = new EventEmitter<TransactionViewModel>();

  operationTypeStringify = operationTypeStringify;

  public isFullFutureShow = false;

  public readonly isTransactionPassed = (model: TransactionViewModel) => {
    return model.date.daySameOrBefore(TuiDay.currentLocal());
  };

  public get futureListShowCount(): number {
    if (!this.futureTransactions) return 0;
    return this.isFullFutureShow ? this.futureTransactions.length : this.futureTransactions.length === 3 ? 3 : 2;
  }

  public get futureListHideCount(): number {
    if (!this.futureTransactions) return 0;
    return this.futureTransactions.length - this.futureListShowCount;
  }

  public get isShowMoreVisible(): boolean {
    return (this.futureTransactions?.length ?? 0) > 3;
  }
}
