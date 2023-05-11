import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { AppUser } from './user';
import { BehaviorSubject, map, Observable } from 'rxjs';

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
}
