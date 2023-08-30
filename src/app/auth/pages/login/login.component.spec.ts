import { ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import LoginComponent from './login.component';
import { FakeAuthService } from '@app/auth/services/fake-auth.service';
import { AuthService } from '@app/auth/services/auth.service';
import { provideRouter, Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useClass: FakeAuthService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error', () => {
    component.form.setValue({ login: 'test@test.com', password: '123' });
    expect(component.form.valid).toBeTrue();
    expect(component.error.value).toBe('');
    expect(component.isLoading).toBeFalse();

    spyOn(TestBed.inject(AuthService), 'login').and.returnValue(
      throwError(() => ({
        message: 'Firebase: test error (auth.test)',
      })),
    );

    component.formSubmit();
    expect(component.error.value).toBe('test error ');
  });

  it('should redirect to main after login', () => {
    component.form.setValue({ login: 'test@test.com', password: '123' });
    expect(component.form.valid).toBeTrue();
    expect(component.error.value).toBe('');
    expect(component.isLoading).toBeFalse();

    const spy = spyOn(TestBed.inject(Router), 'navigate');

    component.formSubmit();
    expect(spy.calls.count()).toBe(1);
  });
});
