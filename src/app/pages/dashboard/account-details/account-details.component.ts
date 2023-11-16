import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiDestroyService, TuiLetModule } from '@taiga-ui/cdk';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiAppearance, TuiDialogService, TuiLoaderModule } from '@taiga-ui/core';
import { DataService } from '@app/data-layer/data.service';
import { filter, map, Observable, shareReplay, switchMap, take, takeUntil, tap } from 'rxjs';
import { AccountData } from '@app/models/account.data';
import { BankInfoService } from '@app/pages/dashboard/services/bank-info.service';
import { TuiAvatarModule } from '@taiga-ui/kit';
import { CONFIRMATION_PROMPT, ConfirmationPromptData } from '@app/components/prompt';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { AddAccountComponent } from '@app/pages/dashboard/dashboard/add-account/add-account.component';
import { OperationData } from '@app/models/operation.data';
import { firestoreAutoId } from '@app/models/identifiable';
import { TransactionViewModel } from '@app/pages/dashboard/account-details/transaction.view-model';
import { AccountInfoCalculatorProviderService } from '@app/services/account-info-calculator-provider.service';
import { AccountActionsComponent } from '@app/pages/dashboard/account-details/account-actions/account-actions.component';
import {
  TransactionFields,
  TransactionFormComponent,
} from '@app/pages/dashboard/account-details/transaction-form/transaction-form.component';
import { TransactionsListComponent } from '@app/pages/dashboard/account-details/transactions-list/transactions-list.component';
import { AccountInfoComponent } from '@app/pages/dashboard/account-details/account-info/account-info.component';
import { AccountFullData } from '@app/models/account-full.data';
import { Money } from '@app/models/money';
import { OperationData2 } from '@app/models/operation/operationData2';
@Component({
  selector: 'monitraks-account-details',
  standalone: true,
  imports: [
    CommonModule,
    TuiLoaderModule,
    TuiAvatarModule,
    TuiLetModule,
    AccountActionsComponent,
    TransactionFormComponent,
    TransactionsListComponent,
    AccountInfoComponent,
  ],
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export default class AccountDetailsComponent {
  constructor(
    private route: ActivatedRoute,
    private readonly router: Router,
    private readonly data: DataService,
    public readonly banks: BankInfoService,
    private readonly calculatorProvider: AccountInfoCalculatorProviderService,
    private readonly dialogs: TuiDialogService,
    private readonly injector: Injector,
    private readonly destroy$: TuiDestroyService,
  ) {
    const accountId$ = this.route.paramMap.pipe(
      takeUntil(destroy$),
      map(params => params.get('id')!),
    );
    const account$ = accountId$.pipe(map(id => this.data.accounts.withId(id)));

    this.fullInfo$ = accountId$.pipe(
      map(id => this.calculatorProvider.getCalculator(id)),
      switchMap(calculator => calculator.calculatedData$),
      tap(() => (this.isLoading = false)),
      shareReplay(1),
    );

    this.accountName$ = this.fullInfo$.pipe(map(data => this.getName(data)));
    this.transactions$ = this.fullInfo$.pipe(
      map(account => account.transactions.map(this.toViewModel).sort((a, b) => (a.date > b.date ? -1 : 1))),
      shareReplay(1),
    );
    this.futureTransactions$ = this.fullInfo$.pipe(
      map(account => account.futureTransactions.map(this.toViewModel).sort((a, b) => (a.date > b.date ? -1 : 1))),
    );

    this.removeAccount$ = account$.pipe(switchMap(account => account.delete()));
    this.updateTransaction$ = (model: OperationData) =>
      account$.pipe(switchMap(account => account.operations.withId(model.id).set(model)));
    this.removeTransaction$ = (id: string) =>
      account$.pipe(switchMap(account => account.operations.withId(id).delete()));
  }

  fullInfo$: Observable<AccountFullData>;
  accountName$: Observable<string>;
  transactions$: Observable<TransactionViewModel[]>;
  futureTransactions$: Observable<TransactionViewModel[]>;
  isLoading = true;

  showTransactionForm = false;
  transactionToEdit: TransactionFields | null = null;

  public saveTransaction(formData: TransactionFields) {
    const operationData = new OperationData2(
      formData.id ?? firestoreAutoId(),
      formData.date!,
      formData.type!,
      Money.fromView(formData.amount!),
      formData.memo,
    ) satisfies OperationData;
    this.hideTransactionForm();
    this._lastSavedTransactionId = operationData.id;
    this.updateTransaction$(operationData).subscribe();
  }

  public hideTransactionForm() {
    this.transactionToEdit = null;
    this.showTransactionForm = false;
  }

  public getName(account: AccountFullData | null): string {
    return account
      ? `${account.accountData.name} (${this.banks.findById(account.accountData.bank)?.name})`
      : 'Аккаунт не найден';
  }

  public deleteAccount(): void {
    this.dialogs
      .open<boolean>(CONFIRMATION_PROMPT, {
        label: 'Удаление вклада',
        data: {
          content:
            '<p>Удаление вклада приведет также к удалению всех связанных с ним операций. ' +
            'Это может повлиять на статистику и отчеты. </p><p>Если срок вклада подошел к концу, то лучше его закрыть: ' +
            'это скроет вклад из списка, но сохранит статистику.</p>',
          yes: 'Удалить',
          no: 'Не удалять',
          yesAppearance: TuiAppearance.Accent,
        } as ConfirmationPromptData,
      })
      .pipe(
        filter(decision => decision),
        tap(() => (this.isLoading = true)),
        switchMap(() => this.removeAccount$),
        tap(() => {
          this.router.navigate(['..']);
        }),
      )
      .subscribe();
  }

  public removeTransaction(id: string): void {
    this.removeTransaction$(id).subscribe();
  }

  public editAccount(): void {
    this.fullInfo$
      .pipe(
        take(1),
        switchMap(data =>
          this.dialogs.open<AccountData>(new PolymorpheusComponent(AddAccountComponent, this.injector), {
            dismissible: false,
            label: 'Редактирование данных',
            size: 'l',
            data: data.accountData,
          }),
        ),
        switchMap(data => this.data.accounts.withId(data.id).set(data)),
      )
      .subscribe();
  }

  public editTransaction(model: TransactionViewModel): void {
    this.transactionToEdit = this.fromViewModel(model);
    this.showTransactionForm = true;
  }

  private readonly toViewModel = (data: OperationData): TransactionViewModel => {
    return {
      id: data.id,
      date: data.date,
      memo: data.memo ?? '',
      type: data.type,
      amount: ['withdrawal', 'commission'].includes(data.type) ? data.money.toNegative() : data.money,
      justSaved: data.id === this._lastSavedTransactionId,
    };
  };

  private readonly fromViewModel = (model: TransactionViewModel): TransactionFields => {
    return {
      id: model.id,
      date: model.date,
      memo: model.memo,
      type: model.type,
      amount: model.amount.toPositive().toView(),
    };
  };

  private _lastSavedTransactionId: string | null = null;

  private readonly updateTransaction$: (model: OperationData) => Observable<void>;
  private readonly removeTransaction$: (id: string) => Observable<void>;
  private readonly removeAccount$: Observable<void>;
}
