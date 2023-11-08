import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiActionModule } from '@taiga-ui/kit';

@Component({
  selector: 'monitraks-account-actions',
  standalone: true,
  imports: [CommonModule, TuiActionModule],
  templateUrl: './account-actions.component.html',
  styleUrls: ['./account-actions.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountActionsComponent {
  @Output()
  public addTransaction = new EventEmitter();

  @Output()
  public editAccount = new EventEmitter();

  @Output()
  public removeAccount = new EventEmitter();
}
