import { ComponentFixture, TestBed } from '@angular/core/testing';

import PasswordResetComponent from './password-reset.component';
import { FakeAuthService } from '@app/auth/services/fake-auth.service';
import { AuthService } from '@app/auth/services/auth.service';
import { provideRouter } from '@angular/router';

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordResetComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useClass: FakeAuthService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
