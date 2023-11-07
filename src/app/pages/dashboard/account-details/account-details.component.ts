import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiAutoFocusModule, TuiDay, TuiDestroyService, TuiLetModule } from '@taiga-ui/cdk';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  TuiAppearance,
  TuiButtonModule,
  TuiDialogService,
  TuiGroupModule,
  TuiHintModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { DataService } from '@app/data-layer/data.service';
import { filter, map, Observable, shareReplay, switchMap, take, takeUntil, tap } from 'rxjs';
import { AccountData } from '@app/models/account.data';
import { BankInfoService } from '@app/pages/dashboard/services/bank-info.service';
import {
  TuiActionModule,
  TuiAvatarModule,
  TuiDataListWrapperModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiSelectModule,
  TuiStringifyContentPipeModule,
} from '@taiga-ui/kit';
import { CONFIRMATION_PROMPT, ConfirmationPromptData } from '@app/components/prompt';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { AddAccountComponent } from '@app/pages/dashboard/dashboard/add-account/add-account.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OperationData, OperationType } from '@app/models/operation.data';
import { Timestamp } from '@angular/fire/firestore';
import { TuiCurrencyPipeModule, TuiMoneyModule } from '@taiga-ui/addon-commerce';
import { firestoreAutoId } from '@app/models/identifiable';
import { TransactionViewModel } from '@app/pages/dashboard/account-details/transaction.view-model';
@Component({
  selector: 'monitraks-account-details',
  standalone: true,
  imports: [
    CommonModule,
    TuiLetModule,
    RouterLink,
    TuiLinkModule,
    TuiLoaderModule,
    TuiActionModule,
    TuiHintModule,
    TuiGroupModule,
    TuiAvatarModule,
    ReactiveFormsModule,
    TuiInputDateModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiStringifyContentPipeModule,
    TuiInputNumberModule,
    TuiCurrencyPipeModule,
    TuiTextfieldControllerModule,
    TuiInputModule,
    TuiButtonModule,
    TuiAutoFocusModule,
    TuiMoneyModule,
    TuiSvgModule,
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
    private readonly dialogs: TuiDialogService,
    private readonly injector: Injector,
    private readonly destroy$: TuiDestroyService,
    fb: FormBuilder,
  ) {
    const accountId$ = this.route.paramMap.pipe(
      takeUntil(destroy$),
      map(params => params.get('id')!),
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

    this.transactionForm = fb.group({
      id: fb.control<string | null>(null),
      date: fb.nonNullable.control(TuiDay.currentLocal(), Validators.required),
      type: fb.control<OperationType | null>(null, Validators.required),
      amount: fb.control<number | null>(null, Validators.required),
      memo: fb.control<string | null>(null),
    });
  }

  accountData$: Observable<AccountData | null>;
  accountName$: Observable<string>;
  transactions$: Observable<TransactionViewModel[]>;
  isLoading = true;

  showTransactionForm = false;
  transactionForm;
  operationTypes = ['contribution', 'withdrawal', 'interest', 'commission'] as OperationType[];

  private readonly updateTransaction$: (model: OperationData) => Observable<void>;
  private readonly removeTransaction$: (id: string) => Observable<void>;
  private readonly removeAccount$: Observable<void>;

  public saveTransaction() {
    if (!this.transactionForm.valid) return;
    const formData = this.transactionForm.getRawValue();
    const operationData = {
      id: formData.id ?? firestoreAutoId(),
      date: Timestamp.fromDate(formData.date!.toLocalNativeDate()),
      type: formData.type!,
      amount: formData.amount!,
      memo: formData.memo,
    } satisfies OperationData;
    this.transactionForm.reset();
    this.showTransactionForm = false;
    this._lastSavedTransactionId = operationData.id;
    this.updateTransaction$(operationData).subscribe();
  }

  public readonly operationTypeStringify = (type: OperationType): string => {
    switch (type) {
      case 'contribution':
        return 'Пополнение';
      case 'withdrawal':
        return 'Снятие';
      case 'interest':
        return 'Проценты';
      case 'commission':
        return 'Комиссия';
    }
  };

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
    this.transactionForm.setValue(this.fromViewModel(model));
    this.showTransactionForm = true;
  }

  private readonly toViewModel = (data: OperationData): TransactionViewModel => {
    console.log(data.id === this._lastSavedTransactionId);
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
}
