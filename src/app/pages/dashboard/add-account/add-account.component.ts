import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { AccountData } from '@app/models/account.data';
import { AddAccountFormComponent } from '@app/pages/dashboard/add-account/add-account-form/add-account-form.component';

@Component({
  selector: 'monitraks-add-account',
  standalone: true,
  imports: [CommonModule, AddAccountFormComponent],
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAccountComponent {
  constructor(@Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<AccountData>) {}

  save(form: any) {}

  close() {
    this.context.$implicit.complete();
  }
}
