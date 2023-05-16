import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@app/auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthLayoutComponent } from '@app/auth/components/auth-layout/auth-layout.component';
import { TuiInputModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLinkModule, TuiNotificationModule } from '@taiga-ui/core';
import { FormBaseComponent } from '@app/auth/components/form-base.component';

@Component({
  selector: 'monitraks-password-reset',
  standalone: true,
  imports: [
    CommonModule,
    AuthLayoutComponent,
    ReactiveFormsModule,
    TuiInputModule,
    TuiNotificationModule,
    TuiButtonModule,
    RouterLink,
    TuiLinkModule,
  ],
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PasswordResetComponent extends FormBaseComponent<{ login: string }> {
  constructor(private auth: AuthService, fb: NonNullableFormBuilder, router: Router) {
    super(
      fb.group({
        login: fb.control('', [Validators.required, Validators.email]),
      }),
      router
    );
  }

  protected override doFormAction(value: { login: string }): Observable<void> {
    return this.auth.sendResetEmail(value.login);
  }
}
