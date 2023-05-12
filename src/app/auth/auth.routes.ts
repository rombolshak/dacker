import { Route } from '@angular/router';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectToDashboard = redirectLoggedInTo('/');
export default [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component'),
    ...canActivate(() => redirectToDashboard),
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.component'),
    ...canActivate(() => redirectToDashboard),
  },
] as Route[];
