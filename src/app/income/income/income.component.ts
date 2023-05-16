import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'monitraks-income',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IncomeComponent {}
