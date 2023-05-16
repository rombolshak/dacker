import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@app/auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, finalize } from 'rxjs';
import { AuthError } from '@angular/fire/auth';
import { AuthLayoutComponent } from '@app/auth/components/auth-layout/auth-layout.component';
import { TuiInputModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLinkModule, TuiNotificationModule } from '@taiga-ui/core';

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
export default class PasswordResetComponent {
  constructor(private fb: NonNullableFormBuilder, private auth: AuthService, private router: Router) {}

  public form = this.fb.group({
    login: this.fb.control('', [Validators.required, Validators.email]),
  });

  public error = new BehaviorSubject('');
  public isLoading = false;

  public formSubmit() {
    this.isLoading = true;
    this.error.next('');
    this.auth
      .sendResetEmail(this.form.controls.login.value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: user => this.router.navigate(['/']),
        error: (err: AuthError) => this.error.next(err.message.replace('Firebase: ', '').replace(/\(auth.*\)\.?/, '')),
      });
  }
}
