import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '@app/data-layer/data.service';
import { Observable } from 'rxjs';
import { AccountData } from '@app/model/account.data';
import { TuiLetModule } from '@taiga-ui/cdk';

@Component({
  selector: 'monitraks-dashboard',
  standalone: true,
  imports: [CommonModule, TuiLetModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent {
  constructor(data: DataService) {
    this.accounts$ = data.accounts.getAll();
  }

  accounts$: Observable<AccountData[]>;
}
