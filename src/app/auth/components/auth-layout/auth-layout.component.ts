import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'monitraks-auth-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {}
