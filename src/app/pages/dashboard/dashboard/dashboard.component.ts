import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '@app/data-layer/data.service';

@Component({
  selector: 'monitraks-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent {
  constructor(data: DataService) {
    data.accounts.getAll();
  }
}
