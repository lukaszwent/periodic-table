import { Routes } from '@angular/router';
import { ErrorPageComponent } from './core/components/error-page/error-page.component';
import { PeriodicTableComponent } from './features/components/periodic-table/periodic-table.component';
import { PeriodicDataResolver } from './features/resolvers/periodic-data.resolver';

export const routes: Routes = [
  {
    path: 'periodic-table',
    resolve: { periodicData: PeriodicDataResolver },
    component: PeriodicTableComponent,
  },
  {
    path: 'error-page',
    component: ErrorPageComponent,
  },
  {
    path: '**',
    redirectTo: 'periodic-table',
  },
];
