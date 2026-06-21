import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'insurance-package' },
  {
    path: 'insurance-package',
    loadComponent: () =>
      import('./insurance-package/insurance-package.component').then(
        (m) => m.InsurancePackageComponent,
      ),
  },
  {
    path: 'summary',
    loadComponent: () => import('./summary/summary.component').then((m) => m.SummaryComponent),
  },
  {
    path: 'product',
    loadComponent: () => import('./product/product.component').then((m) => m.ProductComponent),
  },
  { path: '**', redirectTo: 'insurance-package' },
];
