import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { AuthError } from '@angular/fire/auth';

type ControlsOf<T> = { [K in keyof T]: FormControl<T[K]> };

export abstract class FormBaseComponent<T> {
  protected constructor(
    public form: FormGroup<ControlsOf<T>>,
    private router: Router,
  ) {}

  public error = new BehaviorSubject('');
  public isLoading = false;

  public formSubmit() {
    this.isLoading = true;
    this.error.next('');
    this.doFormAction(this.form.getRawValue() as T)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (err: AuthError) => this.error.next(err.message.replace('Firebase: ', '').replace(/\(auth.*\)\.?/, '')),
      });
  }

  protected abstract doFormAction(value: T): Observable<never>;
}
