import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountData } from '@app/models/account.data';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { BehaviorSubject } from 'rxjs';
import { TUI_ARROW, TuiBadgeModule, TuiTagModule } from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiFormatDatePipeModule,
  TuiHostedDropdownModule,
  TuiSvgModule,
  TuiTooltipModule,
} from '@taiga-ui/core';
import { TuiReorderModule } from '@app/components/reorder';
import { TuiDay, TuiLetModule } from '@taiga-ui/cdk';
import { AsPipe } from '@app/pipes/as.pipe';
import { AccountTableData } from './account-table.data';
import { RouterLink } from '@angular/router';
import { BankInfoService } from '@app/pages/dashboard/services/bank-info.service';

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
    TuiTagModule,
    TuiTooltipModule,
    RouterLink,
  ],
  templateUrl: './accounts-table.component.html',
  styleUrls: ['./accounts-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsTableComponent {
  constructor(private readonly banks: BankInfoService) {}

  @Input()
  public set accounts(data: AccountData[]) {
    this.accountsData = data.map(this.toViewModel.bind(this));
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
    'currentNominalRate',
    'currentRealRate',
    'interestInfo',
  ];

  selectedColumns = this.allColumns;

  iconArrow = TUI_ARROW;

  private toViewModel(model: AccountData): AccountTableData {
    return {
      id: model.id,
      name: model.name,
      bank: this.banks.findById(model.bank)?.name ?? '',
      openedAt: TuiDay.fromLocalNativeDate(model.openedAt.toDate()),
      duration: model.duration,
      closingAt: model.duration
        ? TuiDay.fromLocalNativeDate(model.openedAt.toDate()).append({ day: model.duration })
        : null,
      additionalInfo: {
        canWithdraw: this.getCanWithdrawContent(model),
        canContribute: this.getCanContributeContent(model),
      },
      interestScheduleDescription: {
        repeatType: this.getRepeatOptionContent(model),
        repeatDay: this.getRepeatDayContent(model),
        capitalization: this.getCapitalizationContent(model),
        basis: this.getInterestBasisContent(model),
      },
    } satisfies AccountTableData;
  }

  private readonly getRepeatDayContent = (model: AccountData): string => {
    return model.interestSchedule.type === 'monthly'
      ? model.interestSchedule.day === 31
        ? 'в пoслeдний дeнь мeсяцa'
        : `${model.interestSchedule.day!}-го числа`
      : '';
  };

  private readonly getCapitalizationContent = (model: AccountData): string => {
    return model.interestSchedule.type === 'onClosing'
      ? ''
      : model.interestSchedule.isCapitalizing
      ? 'с кaпитaлизaциeй'
      : 'без капитализации';
  };

  private readonly getInterestBasisContent = (model: AccountData): string => {
    return model.canContribute || model.canWithdraw
      ? model.interestBase === 'everyDay'
        ? 'на ежедневный остаток'
        : 'нa минимальный остаток'
      : '';
  };

  private readonly getRepeatOptionContent = (model: AccountData): string => {
    switch (model.interestSchedule.type) {
      case 'monthly':
        return 'Eжeмесячно';
      case 'quaterly':
        return 'Eжеквартально';
      case 'semiannual':
        return 'Полугодично';
      case 'annually':
        return 'Ежегодно';
      case 'onClosing':
        return 'В конце срока';
    }
  };

  private getCanWithdrawContent(model: AccountData) {
    return model.canWithdraw ? 'со снятием' : 'без снятия';
  }

  private getCanContributeContent(model: AccountData) {
    return model.canContribute ? 'c пoпoлнением' : 'без пoполнeния';
  }
}
