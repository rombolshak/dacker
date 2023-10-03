import { Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectToLogin = redirectUnauthorizedTo('auth/login');

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'auth', loadChildren: () => import('./auth/auth.routes') },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.routes'),
    ...canActivate(() => redirectToLogin),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register/register.component'),
    ...canActivate(() => redirectToLogin),
  },
  {
    path: 'income',
    loadComponent: () => import('./pages/income/income/income.component'),
    ...canActivate(() => redirectToLogin),
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports/reports.component'),
    ...canActivate(() => redirectToLogin),
  },
];
