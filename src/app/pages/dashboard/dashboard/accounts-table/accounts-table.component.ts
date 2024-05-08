import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountData } from '@app/models/account.data';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { BehaviorSubject, concatMap, combineLatest, Observable, map, debounceTime, tap } from 'rxjs';
import { TUI_ARROW, TuiBadgeModule, TuiTagModule } from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiFormatDatePipeModule,
  TuiHostedDropdownModule,
  TuiLoaderModule,
  TuiSvgModule,
  TuiTooltipModule,
} from '@taiga-ui/core';
import { TuiReorderModule } from '@app/components/reorder';
import { TuiDay, TuiLetModule } from '@taiga-ui/cdk';
import { AsPipe } from '@app/pipes/as.pipe';
import { AccountTableData } from './account-table.data';
import { RouterLink } from '@angular/router';
import { BankInfoService } from '@app/pages/dashboard/services/bank-info.service';
import { AccountInfoCalculator } from '@app/services/account-info.calculator';
import { DataService } from '@app/data-layer/data.service';
import { AccountFullData } from '@app/models/account-full.data';

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
    TuiLoaderModule,
  ],
  templateUrl: './accounts-table.component.html',
  styleUrls: ['./accounts-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsTableComponent {
  constructor(
    private readonly banks: BankInfoService,
    private readonly data: DataService,
  ) {
    this.accountsData = this._accountIds.pipe(
      debounceTime(200),
      tap(() => (this.isLoading = true)),
      concatMap(ids =>
        combineLatest(
          ids
            .map(id => this.data.accounts.withId(id))
            .map(builder => new AccountInfoCalculator(builder))
            .map(calculator => calculator.calculatedData$),
        ),
      ),
      map(data => data.filter(acc => !acc.accountData.isClosed).map(this.toViewModel.bind(this))),
      tap(() => (this.isLoading = false)),
    );
  }

  @Input()
  public set accounts(ids: string[]) {
    this._accountIds.next(ids);
  }

  @Output()
  public addRequested = new EventEmitter();

  isLoading: boolean = true;
  accountsData: Observable<AccountTableData[]>;
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
    'interestInfo',
  ];

  selectedColumns = this.allColumns;

  iconArrow = TUI_ARROW;

  private toViewModel(model: AccountFullData): AccountTableData {
    let closingAt = model.accountData.duration
      ? model.accountData.openedAt.append({ day: model.accountData.duration })
      : null;
    return {
      id: model.accountData.id,
      name: model.accountData.name,
      bank: this.banks.findById(model.accountData.bank)?.name ?? '',
      openedAt: model.accountData.openedAt,
      duration: model.accountData.duration,
      closingAt: closingAt,
      additionalInfo: {
        canWithdraw: this.getCanWithdrawContent(model.accountData),
        canContribute: this.getCanContributeContent(model.accountData),
      },
      interestScheduleDescription: {
        repeatType: this.getRepeatOptionContent(model.accountData),
        repeatDay: this.getRepeatDayContent(model.accountData),
        capitalization: this.getCapitalizationContent(model.accountData),
        basis: this.getInterestBasisContent(model.accountData),
      },
      moneyInfo: {
        currentAmount: model.currentMoney.toView(),
        profitAmount: model.receivedProfit.toView(),
        totalProfit: model.totalProfit.toView(),
        rate: model.rate.toFixed(1),
        profitRate: model.xirr.toFixed(3),
      },
      hasPendingTransactions: model.futureTransactions.some(transaction =>
        transaction.date.daySameOrBefore(TuiDay.currentLocal()),
      ),
      isExpired: closingAt != null && closingAt.daySameOrBefore(TuiDay.currentLocal()),
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

  private _accountIds = new BehaviorSubject(<string[]>[]);
}
