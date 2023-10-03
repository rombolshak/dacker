import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiLetModule } from '@taiga-ui/cdk';
import { RouterLink } from '@angular/router';
import { TuiLinkModule, TuiLoaderModule } from '@taiga-ui/core';

@Component({
  selector: 'monitraks-account-details',
  standalone: true,
  imports: [CommonModule, TuiLetModule, RouterLink, TuiLinkModule, TuiLoaderModule],
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AccountDetailsComponent {
  isLoading = true;
}
