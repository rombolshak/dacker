import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'monitraks-auth-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-panel.component.html',
  styleUrls: ['./auth-panel.component.less'],
})
export class AuthPanelComponent {
  constructor(public auth: AuthService, private router: Router) {}
}
