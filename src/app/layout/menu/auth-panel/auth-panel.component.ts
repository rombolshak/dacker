import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@app/auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { TuiDataListModule, TuiSvgModule } from '@taiga-ui/core';

@Component({
  selector: 'monitraks-auth-panel',
  standalone: true,
  imports: [CommonModule, TuiSvgModule, TuiDataListModule, RouterLink],
  templateUrl: './auth-panel.component.html',
  styleUrls: ['./auth-panel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPanelComponent {
  constructor(public auth: AuthService, private router: Router) {}
}
