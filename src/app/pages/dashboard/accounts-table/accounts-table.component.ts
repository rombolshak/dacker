import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountData } from '@app/models/account.data';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { BehaviorSubject } from 'rxjs';
import { TUI_ARROW } from '@taiga-ui/kit';
import { TuiButtonModule, TuiHostedDropdownModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiReorderModule } from '@app/components/reorder';
import { TuiLetModule } from '@taiga-ui/cdk';

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
  imports: [
    CommonModule,
    TuiTableModule,
    TuiReorderModule,
    TuiSvgModule,
    TuiHostedDropdownModule,
    TuiButtonModule,
    TuiReorderModule,
    TuiLetModule,
  ],
  templateUrl: './accounts-table.component.html',
  styleUrls: ['./accounts-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsTableComponent {
  @Input()
  public accounts: AccountData[] = [];

  @Output()
  public addRequested = new EventEmitter();

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

  selectedColumns = this.allColumns;

  iconArrow = TUI_ARROW;
}
