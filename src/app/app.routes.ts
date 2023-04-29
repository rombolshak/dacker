import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard/dashboard.component') },
  { path: 'register', loadComponent: () => import('./register/register/register.component') },
  { path: 'income', loadComponent: () => import('./income/income/income.component') },
  { path: 'reports', loadComponent: () => import('./reports/reports/reports.component') },
];
