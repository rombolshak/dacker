import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountData } from '@app/models/account.data';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { BehaviorSubject } from 'rxjs';
import { TUI_ARROW, TuiBadgeModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiFormatDatePipeModule, TuiHostedDropdownModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiReorderModule } from '@app/components/reorder';
import { TuiDay, TuiLetModule } from '@taiga-ui/cdk';
import { AsPipe } from '@app/pipes/as.pipe';
import { AccountTableData } from '@app/pages/dashboard/accounts-table/account-table.data';

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
    TuiFormatDatePipeModule,
    AsPipe,
    TuiBadgeModule,
  ],
  templateUrl: './accounts-table.component.html',
  styleUrls: ['./accounts-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsTableComponent {
  @Input()
  public set accounts(data: AccountData[]) {
    this.accountsData = data.map(this.toViewModel);
  }

  @Output()
  public addRequested = new EventEmitter();

  accountsData: AccountTableData[] = [];
  AccountTableData!: AccountTableData[];
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
  protected readonly Object = Object;

  private toViewModel(model: AccountData): AccountTableData {
    return {
      name: model.name,
      bank: model.bank,
      openedAt: TuiDay.fromLocalNativeDate(model.openedAt.toDate()),
      duration: model.duration,
      closingAt: model.duration
        ? TuiDay.fromLocalNativeDate(model.openedAt.toDate()).append({ day: model.duration })
        : null,
      canWithdraw: model.canWithdraw,
      canContribute: model.canContribute,
    } satisfies AccountTableData;
  }
}
