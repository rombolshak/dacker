import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiActionModule, TuiIslandModule } from '@taiga-ui/kit';
import { TuiMoneyModule } from '@taiga-ui/addon-commerce';
import { AccountFullData } from '@app/models/account-full.data';
import { TuiButtonModule, TuiGroupModule, TuiLoaderModule } from '@taiga-ui/core';
import { MoneyAmountPipe } from '@app/pipes/money-amount.pipe';

@Component({
  selector: 'monitraks-account-info',
  standalone: true,
  imports: [
    CommonModule,
    TuiIslandModule,
    TuiMoneyModule,
    TuiLoaderModule,
    MoneyAmountPipe,
    TuiActionModule,
    TuiButtonModule,
    TuiGroupModule,
  ],
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountInfoComponent {
  @Input()
  public fullInfo: AccountFullData | null = null;

  @Output()
  public editAccount = new EventEmitter();

  @Output()
  public removeAccount = new EventEmitter();

  @Output()
  public closeAccount = new EventEmitter();
}
