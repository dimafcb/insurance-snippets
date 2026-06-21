import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PRODUCTS_MOCK } from './product.mock';

@Component({
  selector: 'app-product',
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  protected readonly products = PRODUCTS_MOCK;
}
