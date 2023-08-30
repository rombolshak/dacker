import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLinkModule, TuiNotificationModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';
import { AuthLayoutComponent } from '@app/auth/components/auth-layout/auth-layout.component';
import { FormBaseComponent } from '@app/auth/components/form-base.component';

@Component({
  selector: 'monitraks-login',
  standalone: true,
  imports: [
    CommonModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiInputPasswordModule,
    TuiButtonModule,
    TuiLinkModule,
    ReactiveFormsModule,
    RouterLink,
    TuiNotificationModule,
    AuthLayoutComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent extends FormBaseComponent<{ login: string; password: string }> {
  constructor(
    private auth: AuthService,
    fb: NonNullableFormBuilder,
    router: Router,
  ) {
    super(
      fb.group({
        login: fb.control('', [Validators.required, Validators.email]),
        password: fb.control('', [Validators.required]),
      }),
      router,
    );
  }

  protected override doFormAction(value: { login: string; password: string }) {
    return this.auth.login(value);
  }
}
