import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '@app/data-layer/data.service';
import { Observable, takeUntil, tap } from 'rxjs';
import { AccountData } from '@app/models/account.data';
import { TuiDestroyService, TuiLetModule } from '@taiga-ui/cdk';
import { TuiBlockStatusModule } from '@taiga-ui/layout';
import { TuiButtonModule, TuiDialogService, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { AccountsTableComponent } from './accounts-table/accounts-table.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { ActivatedRoute, Router } from '@angular/router';

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
  providers: [TuiDestroyService],
})
export default class DashboardComponent {
  constructor(
    private readonly data: DataService,
    private readonly dialogs: TuiDialogService,
    private readonly injector: Injector,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    destroy$: TuiDestroyService,
  ) {
    this.accounts$ = data.accounts.getAll().pipe(
      takeUntil(destroy$),
      tap(() => (this.isLoading = false)),
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
    this.isLoading = true;
    this.data.accounts
      .withId(model.id)
      .set(model)
      .subscribe(() => this.router.navigate([model.id], { relativeTo: this.route }));
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
}
