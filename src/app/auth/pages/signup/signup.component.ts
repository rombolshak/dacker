import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject, finalize } from 'rxjs';
import { AuthError } from '@angular/fire/auth';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLinkModule, TuiNotificationModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { Router, RouterLink } from '@angular/router';

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
})
export default class SignupComponent {
  constructor(private fb: NonNullableFormBuilder, private auth: AuthService, private router: Router) {}

  public form = this.fb.group({
    login: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required]),
  });

  public error = new BehaviorSubject('');
  public isLoading = false;

  public formSubmit() {
    this.isLoading = true;
    this.error.next('');
    this.auth
      .register(this.form.getRawValue())
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: user => this.router.navigate(['/']),
        error: (err: AuthError) => this.error.next(err.message.replace('Firebase: ', '').replace(/\(auth.*\)\.?/, '')),
      });
  }
}
