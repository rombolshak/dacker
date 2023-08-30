import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiReorderModule } from '@taiga-ui/addon-table';
import { TuiTilesModule } from '@taiga-ui/kit';
import { TuiSvgModule } from '@taiga-ui/core';

@Component({
  selector: 'monitraks-income',
  standalone: true,
  imports: [CommonModule, TuiReorderModule, TuiTilesModule, TuiSvgModule],
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IncomeComponent {
  order = ['1', '2', '3'];

  orderMap = new Map<number, number>();

  selected = this.order;

  reorder($event: Map<number, number>) {
    console.log('reorder');
    this.orderMap = $event;
  }
}
