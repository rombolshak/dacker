import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { AppUser } from '@app/auth/services/user';

@Injectable({
  providedIn: 'root',
})
export class FakeAuthService {
  constructor() {
    this.user$ = this.userData.asObservable();
    this.isAuthenticated$ = this.user$.pipe(map(u => u != null));
  }

  public isAuthenticated$: Observable<boolean>;

  public user$: Observable<AppUser | null>;

  private userData = new BehaviorSubject<AppUser | null>(null);

  login(data: { login: string; password: string }) {
    this.userData.next({ uid: 'user', email: data.login });
    return of({});
  }

  register(data: { login: string; password: string }) {
    this.userData.next({ uid: 'user', email: data.login });
    return of({});
  }
}
