import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthPanelComponent } from './auth-panel.component';
import { AuthService } from '@app/auth/services/auth.service';
import { FakeAuthService } from '@app/auth/services/fake-auth.service';

describe('AuthPanelComponent', () => {
  let component: AuthPanelComponent;
  let fixture: ComponentFixture<AuthPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthPanelComponent],
      providers: [
        {
          provide: AuthService,
          useClass: FakeAuthService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
