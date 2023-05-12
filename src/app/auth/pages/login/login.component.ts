import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLinkModule, TuiNotificationModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject, finalize } from 'rxjs';
import firebase from 'firebase/compat';
import FirebaseError = firebase.FirebaseError;
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';

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
export default class LoginComponent {
  constructor(private fb: NonNullableFormBuilder, private auth: AuthService) {}

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
      .login(this.form.getRawValue())
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: user => console.log(user),
        error: (err: FirebaseError) =>
          this.error.next(err.message.replace('Firebase: ', '').replace(/\(auth.*\)\.?/, '')),
      });
  }
}
