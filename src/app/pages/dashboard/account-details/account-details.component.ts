import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiLetModule } from '@taiga-ui/cdk';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  TuiAlertService,
  TuiAppearance,
  TuiDialogService,
  TuiGroupModule,
  TuiHintModule,
  TuiLinkModule,
  TuiLoaderModule,
} from '@taiga-ui/core';
import { DataService } from '@app/data-layer/data.service';
import {
  BehaviorSubject,
  filter,
  finalize,
  last,
  map,
  Observable,
  shareReplay,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs';
import { AccountData } from '@app/models/account.data';
import { BankInfoService } from '@app/pages/dashboard/services/bank-info.service';
import { TuiActionModule, TuiAvatarModule } from '@taiga-ui/kit';
import { CONFIRMATION_PROMPT, ConfirmationPromptData } from '@app/components/prompt';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { AddAccountComponent } from '@app/pages/dashboard/dashboard/add-account/add-account.component';

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
    private readonly alerts: TuiAlertService,
    private readonly injector: Injector,
  ) {
    const account$ = this.reload$.pipe(
      tap(() => (this.isLoading = true)),
      switchMap(() => this.route.paramMap),
      map(params => this.data.accounts.withId(params.get('id')!)),
    );

    this.accountData$ = account$.pipe(
      switchMap(account => account.get().pipe(finalize(() => (this.isLoading = false)))),
      shareReplay(1),
    );

    this.accountName$ = this.accountData$.pipe(map(data => this.getName(data)));
    this.removeAccount$ = account$.pipe(switchMap(account => account.delete()));
  }

  accountData$: Observable<AccountData | null>;
  accountName$: Observable<string>;
  removeAccount$: Observable<void>;
  isLoading = true;

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
        switchMap(() => this.accountName$),
        tap(() => {
          this.router.navigate(['..']);
        }),
        switchMap(name =>
          this.alerts.open(`Вклад ${name} удалён`, { label: 'Удаление вклада', status: 'success', autoClose: true }),
        ),
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
        tap(() => (this.isLoading = true)),
        switchMap(data => this.data.accounts.withId(data.id).set(data)),
      )
      .subscribe(() => this.reload$.next(true));
  }

  private reload$ = new BehaviorSubject(true);
}
