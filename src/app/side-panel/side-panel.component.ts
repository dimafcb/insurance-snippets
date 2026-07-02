import { Component } from '@angular/core';

interface SidePanelAction {
  icon: string;
  label: string;
}

const SIDE_PANEL_ACTIONS: SidePanelAction[] = [
  { icon: '💰', label: '% Commissions' },
  { icon: '📄', label: 'Policy Documents' },
  { icon: '🧮', label: 'Premium Calculator' },
  { icon: '📊', label: 'Coverage Report' },
  { icon: '🔔', label: 'Renewal Reminders' },
  { icon: '🛡️', label: 'Claims History' },
  { icon: '👤', label: 'Beneficiaries' },
  { icon: '💬', label: 'Contact Advisor' },
  { icon: '⭐', label: 'Loyalty Rewards' },
];

@Component({
  selector: 'app-side-panel',
  imports: [],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.scss',
})
export class SidePanelComponent {
  protected readonly actions = SIDE_PANEL_ACTIONS;
}
