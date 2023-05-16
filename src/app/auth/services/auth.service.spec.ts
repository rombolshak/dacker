import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { FakeAuthService } from '@app/auth/services/fake-auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useClass: FakeAuthService,
        },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
