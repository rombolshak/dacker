import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiIslandModule } from '@taiga-ui/kit';
import { TuiMoneyModule } from '@taiga-ui/addon-commerce';

@Component({
  selector: 'monitraks-account-info',
  standalone: true,
  imports: [CommonModule, TuiIslandModule, TuiMoneyModule],
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountInfoComponent {}
