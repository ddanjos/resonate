import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Resonate · Catálogo',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'detail/:id',
    title: 'Resonate · Detalhe',
    loadComponent: () => import('./pages/detail/detail.page').then((m) => m.DetailPage),
  },
  {
    path: 'presets',
    title: 'Resonate · Presets',
    loadComponent: () => import('./pages/presets/presets.page').then((m) => m.PresetsPage),
  },
  {
    path: 'login',
    title: 'Resonate · Acessar conta',
    loadComponent: () => import('./pages/auth/auth.page').then((m) => m.AuthPage),
  },
  {
    path: '**',
    title: 'Resonate · Página não encontrada',
    loadComponent: () => import('./pages/not-found/not-found.page').then((m) => m.NotFoundPage),
  },
];
