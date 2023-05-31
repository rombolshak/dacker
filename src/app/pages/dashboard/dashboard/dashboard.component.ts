import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '@app/data-layer/data.service';
import { Observable, tap } from 'rxjs';
import { AccountData } from '@app/models/account.data';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiBlockStatusModule } from '@taiga-ui/layout';
import { TuiButtonModule, TuiDialogService, TuiSvgModule } from '@taiga-ui/core';
import { AddAccountComponent } from '@app/pages/dashboard/add-account/add-account.component';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'monitraks-dashboard',
  standalone: true,
  imports: [CommonModule, TuiLetModule, TuiBlockStatusModule, TuiButtonModule, TuiSvgModule, AddAccountComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent {
  constructor(data: DataService, private readonly dialogs: TuiDialogService, private readonly injector: Injector) {
    this.accounts$ = data.accounts.getAll();
  }

  accounts$: Observable<AccountData[]>;

  addAccount(): void {
    this.addAccountDialog.subscribe({
      next: value => console.log(value),
      complete: () => console.log('complete'),
    });
  }

  private readonly addAccountDialog = this.dialogs.open<AccountData>(
    new PolymorpheusComponent(AddAccountComponent, this.injector),
    {
      dismissible: false,
      label: 'Новый счёт',
      data: {},
    }
  );
}
