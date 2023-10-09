import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageStatusService } from '@app/data-layer/storage-status.service';
import { TuiBadgeModule } from '@taiga-ui/kit';
import { concatMap, delay, from, iif, Observable, of, startWith, switchMap } from 'rxjs';
import { TuiLetModule } from '@taiga-ui/cdk';
import { AnimationOptions } from '@angular/animations';
import { TUI_ANIMATION_OPTIONS, tuiFadeIn } from '@taiga-ui/core';

type SavingState = 'active' | 'completed' | 'none';

@Component({
  selector: 'monitraks-storage-status',
  standalone: true,
  imports: [CommonModule, TuiBadgeModule, TuiLetModule],
  templateUrl: './storage-status.component.html',
  styleUrls: ['./storage-status.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [tuiFadeIn],
})
export class StorageStatusComponent {
  constructor(
    public readonly statusService: StorageStatusService,
    @Inject(TUI_ANIMATION_OPTIONS) readonly options: AnimationOptions,
  ) {
    this.savingState$ = this.statusService.isSaving$.pipe(
      switchMap(isSaving =>
        iif(
          () => isSaving,
          of<SavingState>('active'),
          from<SavingState[]>(['completed', 'none']).pipe(
            concatMap(state => of(state).pipe(delay(state === 'none' ? 3000 : 0))),
          ),
        ),
      ),
      startWith<SavingState>('none'),
    );
  }

  public savingState$: Observable<SavingState>;
}
