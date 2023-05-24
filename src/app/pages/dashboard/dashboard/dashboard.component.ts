import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '@app/data-layer/data.service';
import { Observable, tap } from 'rxjs';
import { AccountData } from '@app/models/account.data';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiBlockStatusModule } from '@taiga-ui/layout';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { AddAccountComponent } from '@app/pages/dashboard/add-account/add-account.component';

@Component({
  selector: 'monitraks-dashboard',
  standalone: true,
  imports: [CommonModule, TuiLetModule, TuiBlockStatusModule, TuiButtonModule, TuiSvgModule, AddAccountComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent {
  constructor(data: DataService) {
    this.accounts$ = data.accounts.getAll().pipe(
      tap(a =>
        a.map(q => {
          if (q.duration.days) {
            q.duration.days;
          }
        })
      )
    );
  }

  accounts$: Observable<AccountData[]>;
}
