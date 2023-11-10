import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiIslandModule } from '@taiga-ui/kit';
import { TuiMoneyModule } from '@taiga-ui/addon-commerce';
import { AccountFullData } from '@app/models/account-full.data';
import { TuiLoaderModule } from '@taiga-ui/core';
import { MoneyAmountPipe } from '@app/pipes/money-amount.pipe';

@Component({
  selector: 'monitraks-account-info',
  standalone: true,
  imports: [CommonModule, TuiIslandModule, TuiMoneyModule, TuiLoaderModule, MoneyAmountPipe],
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountInfoComponent {
  @Input()
  public fullInfo: AccountFullData | null = null;
}
