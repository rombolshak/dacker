import { Routes } from '@angular/router';
import { AuthPipe, canActivate, emailVerified } from '@angular/fire/auth-guard';
import { map, pipe } from 'rxjs';

const redirectUnverifiedTo: (redirect: string | any[]) => AuthPipe = redirect =>
  pipe(
    emailVerified,
    map(verified => verified || redirect)
  );

const redirectToLogin = redirectUnverifiedTo('auth/login');

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'auth', loadChildren: () => import('./auth/auth.routes') },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard/dashboard.component'),
    ...canActivate(() => redirectToLogin),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register/register.component'),
    ...canActivate(() => redirectToLogin),
  },
  {
    path: 'income',
    loadComponent: () => import('./income/income/income.component'),
    ...canActivate(() => redirectToLogin),
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports/reports/reports.component'),
    ...canActivate(() => redirectToLogin),
  },
];
