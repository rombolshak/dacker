import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'monitraks-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ReportsComponent {}
