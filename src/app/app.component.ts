import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './layout/menu/menu.component';
import { TuiRootModule } from '@taiga-ui/core';
import { AuthService } from './auth/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenuComponent, TuiRootModule],
  selector: 'monitraks-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(public auth: AuthService) {}
  title = 'monitraks';
}
