import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLinkModule, TuiNotificationModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { Router, RouterLink } from '@angular/router';
import { FormBaseComponent } from '@app/auth/components/form-base.component';

@Component({
  selector: 'monitraks-signup',
  standalone: true,
  imports: [
    CommonModule,
    AuthLayoutComponent,
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiNotificationModule,
    TuiButtonModule,
    TuiLinkModule,
    RouterLink,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignupComponent extends FormBaseComponent<{ login: string; password: string }> {
  constructor(private auth: AuthService, fb: NonNullableFormBuilder, router: Router) {
    super(
      fb.group({
        login: fb.control('', [Validators.required, Validators.email]),
        password: fb.control('', [Validators.required]),
      }),
      router
    );
  }

  protected override doFormAction(value: { login: string; password: string }) {
    return this.auth.register(value);
  }
}
