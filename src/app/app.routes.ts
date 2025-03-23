import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'checklists', pathMatch: 'full' },
  {
    path: 'checklists',
    loadComponent: () =>
      import('./checklists/checklist-list.page.component'),
  },
  {
    path: 'checklists/:id',
    loadComponent: () =>
      import('./checklists/checklist-detail.page.component'),
  },
];
