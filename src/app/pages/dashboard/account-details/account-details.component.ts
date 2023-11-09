import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiDay, TuiDestroyService, TuiLetModule } from '@taiga-ui/cdk';
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
import { Timestamp } from '@angular/fire/firestore';
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

    this.fullInfo$ = accountId$.pipe(
      map(id => this.calculatorProvider.getCalculator(id)),
      switchMap(calculator => calculator.calculatedData$),
    );

    const account$ = accountId$.pipe(map(id => this.data.accounts.withId(id)));
    const operations$ = account$.pipe(map(account => account.operations));

    this.accountData$ = account$.pipe(
      switchMap(account => account.get().pipe(tap(() => (this.isLoading = false)))),
      shareReplay(1),
    );

    this.accountName$ = this.accountData$.pipe(map(data => this.getName(data)));
    this.removeAccount$ = account$.pipe(switchMap(account => account.delete()));

    this.transactions$ = operations$.pipe(
      switchMap(operations => operations.getAll()),
      map(data => data.map(this.toViewModel).sort((a, b) => (a.date > b.date ? -1 : 1))),
      shareReplay(1),
    );
    this.updateTransaction$ = (model: OperationData) =>
      operations$.pipe(switchMap(operations => operations.withId(model.id).set(model)));
    this.removeTransaction$ = (id: string) => operations$.pipe(switchMap(operations => operations.withId(id).delete()));
  }

  fullInfo$: Observable<AccountFullData>;
  accountData$: Observable<AccountData | null>;
  accountName$: Observable<string>;
  transactions$: Observable<TransactionViewModel[]>;
  isLoading = true;

  showTransactionForm = false;
  transactionToEdit: TransactionFields | null = null;

  public saveTransaction(formData: TransactionFields) {
    const operationData = {
      id: formData.id ?? firestoreAutoId(),
      date: Timestamp.fromDate(formData.date!.toLocalNativeDate()),
      type: formData.type!,
      amount: formData.amount!,
      memo: formData.memo,
    } satisfies OperationData;
    this.hideTransactionForm();
    this._lastSavedTransactionId = operationData.id;
    this.updateTransaction$(operationData).subscribe();
  }

  public hideTransactionForm() {
    this.transactionToEdit = null;
    this.showTransactionForm = false;
  }

  public getName(account: AccountData | null): string {
    return account ? `${account.name} (${this.banks.findById(account.bank)?.name})` : 'Аккаунт не найден';
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
    this.accountData$
      .pipe(
        take(1),
        switchMap(data =>
          this.dialogs.open<AccountData>(new PolymorpheusComponent(AddAccountComponent, this.injector), {
            dismissible: false,
            label: 'Редактирование данных',
            size: 'l',
            data: data,
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
      date: TuiDay.fromLocalNativeDate(data.date.toDate()),
      memo: data.memo ?? '',
      type: data.type,
      amount: data.amount >= 0 && ['withdrawal', 'commission'].includes(data.type) ? -data.amount : data.amount,
      justSaved: data.id === this._lastSavedTransactionId,
    };
  };

  private readonly fromViewModel = (model: TransactionViewModel) => {
    return {
      id: model.id,
      date: model.date,
      memo: model.memo,
      type: model.type,
      amount: model.amount < 0 && ['withdrawal', 'commission'].includes(model.type) ? -model.amount : model.amount,
    };
  };

  private _lastSavedTransactionId: string | null = null;

  private readonly updateTransaction$: (model: OperationData) => Observable<void>;
  private readonly removeTransaction$: (id: string) => Observable<void>;
  private readonly removeAccount$: Observable<void>;
}
