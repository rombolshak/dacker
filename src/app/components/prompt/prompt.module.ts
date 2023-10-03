import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';
import { TuiButtonModule } from '@taiga-ui/core';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';

import { ConfirmationPromptComponent } from './prompt.component';

@NgModule({
  imports: [CommonModule, PolymorpheusModule, TuiButtonModule, TuiAutoFocusModule],
  declarations: [ConfirmationPromptComponent],
  exports: [ConfirmationPromptComponent],
})
export class TuiPromptModule {}
