import { Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword } from '@angular/fire/auth';
import { AppUser } from './user';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {
    authState(auth).subscribe(user => {
      this.userData.next(user);
    });

    this.user$ = this.userData.asObservable();
    this.isAuthenticated$ = this.user$.pipe(map(u => u != null && u.emailVerified));
  }

  public isAuthenticated$: Observable<boolean>;

  public user$: Observable<AppUser | null>;

  private userData = new BehaviorSubject<AppUser | null>(null);

  login(data: { login: string; password: string }) {
    return fromPromise(signInWithEmailAndPassword(this.auth, data.login, data.password));
  }
}
