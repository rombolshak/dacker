import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TUI_IS_MOBILE } from '@taiga-ui/cdk';
import { TuiAppearance, TuiDialogContext } from '@taiga-ui/core';
import { TUI_PROMPT_WORDS } from '@taiga-ui/kit/tokens';
import { POLYMORPHEUS_CONTEXT, PolymorpheusComponent, PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';

export interface ConfirmationPromptData {
  readonly content?: PolymorpheusContent;
  readonly no?: string;
  readonly yes?: string;
  readonly noAppearance?: TuiAppearance;
  readonly yesAppearance?: TuiAppearance;
}

@Component({
  selector: 'monitraks-prompt',
  templateUrl: './prompt.template.html',
  styleUrls: ['./prompt.style.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationPromptComponent {
  constructor(
    @Inject(TUI_PROMPT_WORDS) readonly words$: Observable<{ no: string; yes: string }>,
    @Inject(POLYMORPHEUS_CONTEXT)
    readonly context: TuiDialogContext<boolean, ConfirmationPromptData | undefined>,
    @Inject(TUI_IS_MOBILE) private readonly isMobile: boolean,
  ) {}

  get appearance(): TuiAppearance {
    return this.isMobile ? TuiAppearance.Secondary : TuiAppearance.Flat;
  }
}

export const CONFIRMATION_PROMPT = new PolymorpheusComponent(ConfirmationPromptComponent);
