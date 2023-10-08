import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '@app/data-layer/data.service';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { AccountData } from '@app/models/account.data';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiBlockStatusModule } from '@taiga-ui/layout';
import { TuiButtonModule, TuiDialogService, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { firestoreAutoId } from '@app/models/identifiable';
import { AccountsTableComponent } from './accounts-table/accounts-table.component';
import { AddAccountComponent } from './add-account/add-account.component';

@Component({
  selector: 'monitraks-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TuiLetModule,
    TuiBlockStatusModule,
    TuiButtonModule,
    TuiSvgModule,
    AddAccountComponent,
    TuiLoaderModule,
    AccountsTableComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent {
  constructor(
    private readonly data: DataService,
    private readonly dialogs: TuiDialogService,
    private readonly injector: Injector,
  ) {
    this.accounts$ = this.reload$.pipe(
      tap(() => (this.isLoading = true)),
      switchMap(() => data.accounts.getAll().pipe(tap(() => (this.isLoading = false)))),
    );
  }

  accounts$: Observable<AccountData[]>;
  isLoading = true;

  addAccount(): void {
    this.addAccountDialog.subscribe({
      next: value => this.updateAccount(value),
    });
  }

  private updateAccount(model: AccountData): void {
    if (model.id === '') {
      model.id = firestoreAutoId();
    }

    this.isLoading = true;
    this.data.accounts
      .withId(model.id)
      .set(model)
      .subscribe(() => this.reload$.next(true));
  }

  private readonly addAccountDialog = this.dialogs.open<AccountData>(
    new PolymorpheusComponent(AddAccountComponent, this.injector),
    {
      dismissible: false,
      label: 'Новый счёт',
      size: 'l',
      data: null,
    },
  );

  private reload$ = new BehaviorSubject(true);
}
