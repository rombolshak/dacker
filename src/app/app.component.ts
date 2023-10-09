import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './layout/menu/menu.component';
import { TuiDialogModule, TuiRootModule } from '@taiga-ui/core';
import { AuthService } from './auth/services/auth.service';
import { StorageStatusComponent } from '@app/components/storage-status/storage-status.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenuComponent, TuiRootModule, TuiDialogModule, StorageStatusComponent],
  selector: 'monitraks-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(public auth: AuthService) {}
  title = 'monitraks';
}
