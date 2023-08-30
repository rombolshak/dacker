import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountData } from '@app/models/account.data';
import { TuiReorderModule, TuiTableModule } from '@taiga-ui/addon-table';
import { BehaviorSubject } from 'rxjs';
import { TuiTilesModule } from '@taiga-ui/kit';
import { TuiSvgModule } from '@taiga-ui/core';

type Key =
  | 'name'
  | 'bank'
  | 'currentTotalAmount'
  | 'currentIncomeAmount'
  | 'currentIncomePercent'
  | 'expectedIncomeAmount'
  | 'openedAt'
  | 'duration'
  | 'closingAt'
  | 'canContribute'
  | 'canWithdraw'
  | 'currentNominalRate'
  | 'currentRealRate'
  | 'interestInfo';
@Component({
  selector: 'monitraks-accounts-table',
  standalone: true,
  imports: [CommonModule, TuiTableModule, TuiReorderModule, TuiTilesModule, TuiSvgModule],
  templateUrl: './accounts-table.component.html',
  styleUrls: ['./accounts-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsTableComponent {
  @Input()
  public accounts: AccountData[] = [];

  readonly sorter$ = new BehaviorSubject<Key | null>('closingAt');
  allColumns: readonly string[] = [
    'name',
    'bank',
    'currentTotalAmount',
    'currentIncomeAmount',
    'currentIncomePercent',
    'expectedIncomeAmount',
    'openedAt',
    'duration',
    'closingAt',
    'canContribute',
    'canWithdraw',
    'currentNominalRate',
    'currentRealRate',
    'interestInfo',
  ];

  order = ['1', '2', '3'];

  orderMap = new Map<number, number>();

  selected = this.order;

  reorder($event: Map<number, number>) {
    console.log('reorder');
    this.orderMap = $event;
  }
}
