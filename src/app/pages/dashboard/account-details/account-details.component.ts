import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiDay, TuiLetModule } from '@taiga-ui/cdk';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  TuiAppearance,
  TuiButtonModule,
  TuiDialogService,
  TuiGroupModule,
  TuiHintModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { DataService } from '@app/data-layer/data.service';
import { filter, map, Observable, shareReplay, switchMap, take, tap } from 'rxjs';
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
import { FormBuilder, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OperationData, OperationType } from '@app/models/operation.data';
import { Timestamp } from '@angular/fire/firestore';
import { TuiCurrencyPipeModule } from '@taiga-ui/addon-commerce';

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
  ],
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AccountDetailsComponent {
  constructor(
    private route: ActivatedRoute,
    private readonly router: Router,
    private readonly data: DataService,
    public readonly banks: BankInfoService,
    private readonly dialogs: TuiDialogService,
    private readonly injector: Injector,
    private readonly fb: FormBuilder,
  ) {
    const account$ = this.route.paramMap.pipe(map(params => this.data.accounts.withId(params.get('id')!)));

    this.accountData$ = account$.pipe(
      switchMap(account => account.get().pipe(tap(() => (this.isLoading = false)))),
      shareReplay(1),
    );

    this.accountName$ = this.accountData$.pipe(map(data => this.getName(data)));
    this.removeAccount$ = account$.pipe(switchMap(account => account.delete()));

    this.transactionForm = fb.group({
      date: fb.control(TuiDay.currentLocal(), Validators.required),
      type: fb.control<OperationType | null>(null, Validators.required),
      amount: fb.control<number | null>(null, Validators.required),
      memo: fb.control<string | null>(null),
    });
  }

  accountData$: Observable<AccountData | null>;
  accountName$: Observable<string>;
  removeAccount$: Observable<void>;
  isLoading = true;

  transactionForm;
  operationTypes = ['contribution', 'withdrawal', 'interest', 'commission'] as OperationType[];

  readonly operationTypeStringify = (type: OperationType): string => {
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

  public deleteAccount() {
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
}
