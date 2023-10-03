import { Route } from '@angular/router';

export default [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./dashboard/dashboard.component'),
  },
  {
    path: ':id',
    loadComponent: () => import('./account-details/account-details.component'),
  },
] as Route[];
