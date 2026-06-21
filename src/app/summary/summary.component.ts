import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { POLICY_SUMMARY_MOCK } from './summary.mock';

@Component({
  selector: 'app-summary',
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  protected readonly summary = POLICY_SUMMARY_MOCK;
}
