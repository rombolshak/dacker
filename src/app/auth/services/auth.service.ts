import { Injectable } from '@angular/core';
import {
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  Auth,
} from '@angular/fire/auth';
import { AppUser } from './user';
import { BehaviorSubject, from, map, Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {
    authState(auth).subscribe(user => {
      console.log('user changed', user);
      this.userData.next(user);
    });

    this.user$ = this.userData.asObservable();
    this.isAuthenticated$ = this.user$.pipe(map(u => u != null));
  }

  public isAuthenticated$: Observable<boolean>;

  public user$: Observable<AppUser | null>;

  private userData = new BehaviorSubject<AppUser | null>(null);

  login(data: { login: string; password: string }) {
    return fromPromise(signInWithEmailAndPassword(this.auth, data.login, data.password));
  }

  register(data: { login: string; password: string }) {
    return fromPromise(createUserWithEmailAndPassword(this.auth, data.login, data.password));
  }

  sendResetEmail(email: string) {
    return fromPromise(sendPasswordResetEmail(this.auth, email));
  }

  logout() {
    return from(signOut(this.auth));
  }
}
