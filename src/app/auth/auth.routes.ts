import { Route } from '@angular/router';

export default [
  { path: 'login', loadComponent: () => import('./pages/login/login.component') },
  { path: 'signup', loadComponent: () => import('./pages/signup/signup.component') },
] as Route[];
