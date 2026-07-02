import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { SidePanelComponent } from './side-panel/side-panel.component';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, SidePanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
