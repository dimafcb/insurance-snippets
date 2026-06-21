import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

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
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly sidePanelActions = SIDE_PANEL_ACTIONS;
}
