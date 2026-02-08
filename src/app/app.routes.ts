import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'visualizer',
    loadComponent: () =>
      import('./features/visualizer/visualizer.component').then(
        (m) => m.VisualizerComponent,
      ),
  },
];
