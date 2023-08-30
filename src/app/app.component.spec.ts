import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { FakeAuthService } from '@app/auth/services/fake-auth.service';
import { AuthService } from '@app/auth/services/auth.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useClass: FakeAuthService,
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'monitraks'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('monitraks');
  });

  it('should render menu for authenticated user', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('monitraks-menu')).toBeNull();

    const auth = TestBed.inject(AuthService);
    auth.login({ login: 'test@test', password: '' }).subscribe();
    fixture.detectChanges();
    expect(compiled.querySelector('monitraks-menu')?.textContent).toContain('Monitraks');
  });
});
