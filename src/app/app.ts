import { Component } from '@angular/core';

import { InsurancePackageComponent } from './insurance-package/insurance-package.component';

@Component({
  selector: 'app-root',
  imports: [InsurancePackageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
