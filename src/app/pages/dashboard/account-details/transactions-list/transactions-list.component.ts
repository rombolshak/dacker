import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionViewModel } from '@app/pages/dashboard/account-details/transaction.view-model';
import { operationTypeStringify } from '../localization.helper';
import { TuiHintModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiMoneyModule } from '@taiga-ui/addon-commerce';
import { MoneyAmountPipe } from '@app/pipes/money-amount.pipe';

@Component({
  selector: 'monitraks-transactions-list',
  standalone: true,
  imports: [CommonModule, TuiSvgModule, TuiMoneyModule, TuiHintModule, MoneyAmountPipe],
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsListComponent {
  @Input()
  public transactions: TransactionViewModel[] | null = null;

  @Output()
  public edit = new EventEmitter<TransactionViewModel>();

  @Output()
  public remove = new EventEmitter<TransactionViewModel>();

  operationTypeStringify = operationTypeStringify;
}
