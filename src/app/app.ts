import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject, Observable, delay, map, of, switchMap } from 'rxjs';
import { AutocompleteDirective } from './material-autocomplete.directive';

interface AgentIdentifier {
  agentId: string;
  login: string;
}

interface Agent {
  id: AgentIdentifier;
  name: string;
}

interface AgentOption {
  id: AgentIdentifier;
  name: string;
  surname: string;
}

interface CityOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  styleUrls: ['./app.css'],
  templateUrl: './app.html',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    AutocompleteDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly coverageOptions: string[] = ['Basic', 'Standard', 'Premium'];
  selectedCoverage = 'Standard';

  policyHolderName = 'Jane Doe';
  policyNotes = '';

  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);

  constructor() {
    this.iconRegistry.addSvgIcon(
      'close',
      this.sanitizer.bypassSecurityTrustResourceUrl('icons/close.svg'),
    );
  }

  private readonly agentSearchTextSubject = new BehaviorSubject<string>('');

  readonly agentOptions: AgentOption[] = [
    {
      id: { agentId: 'A-100', login: 'abaker' },
      name: 'Anna',
      surname: 'Baker',
    },
    {
      id: { agentId: 'A-101', login: 'ckent' },
      name: 'Clark',
      surname: 'Kent',
    },
    {
      id: { agentId: 'A-102', login: 'dprince' },
      name: 'Diana',
      surname: 'Prince',
    },
  ];

  readonly agentValueDisplayWith = (value: Agent): string => value.name;
  readonly agentOptionDisplayWith = (option: AgentOption): string => `${option.name} ${option.surname}`;

  readonly agentIsValueEmpty = (item: Agent | null): boolean => !item;
  readonly agentCompareWith = (item: Agent | null, option: AgentOption): boolean => {
    if (!item) {
      return false;
    }

    return item.id.agentId === option.id.agentId && item.id.login === option.id.login;
  };

  selectedAgent: Agent | null = {
    id: { agentId: 'A-101', login: 'ckent' },
    name: 'Clark Kent',
  };

  agentSearchText = '';

  readonly filteredAgentOptions$: Observable<AgentOption[]> = this.agentSearchTextSubject.pipe(
    map((value) => value.trim().toLowerCase()),
    switchMap((normalizedSearch) =>
      of(
        normalizedSearch
          ? this.agentOptions.filter((item) =>
              this.agentOptionDisplayWith(item).toLowerCase().includes(normalizedSearch),
            )
          : this.agentOptions,
      ).pipe(delay(Math.floor(Math.random() * 501))),
    ),
  );

  handleAgentValueChange(option: AgentOption | null): void {
    this.selectedAgent = option ? { id: option.id, name: `${option.name} ${option.surname}` } : null;
  }

  handleAgentSearchTextChange(value: string | null | undefined): void {
    const nextSearchText = value ?? '';
    this.agentSearchText = nextSearchText;
    this.agentSearchTextSubject.next(nextSearchText);
  }

  private readonly citySearchTextSubject = new BehaviorSubject<string>('');

  readonly cityOptions: CityOption[] = [
    { id: 'nyc', name: 'New York City' },
    { id: 'lon', name: 'London' },
    { id: 'tok', name: 'Tokyo' },
  ];

  readonly cityValueDisplayWith = (id: string): string => id;
  readonly cityOptionDisplayWith = (option: CityOption): string => option.name;

  readonly cityIsValueEmpty = (id: string | null): boolean => !id;
  readonly cityCompareWith = (id: string | null, option: CityOption): boolean => id === option.id;

  selectedCityId: string | null = 'lon';

  citySearchText = '';

  readonly filteredCityOptions$: Observable<CityOption[]> = this.citySearchTextSubject.pipe(
    map((value) => value.trim().toLowerCase()),
    switchMap((normalizedSearch) =>
      of(
        normalizedSearch
          ? this.cityOptions.filter((option) =>
              option.name.toLowerCase().includes(normalizedSearch),
            )
          : this.cityOptions,
      ).pipe(delay(Math.floor(Math.random() * 501))),
    ),
  );

  handleCityValueChange(option: CityOption | null): void {
    this.selectedCityId = option ? option.id : null;
  }

  handleCitySearchTextChange(value: string | null | undefined): void {
    const nextSearchText = value ?? '';
    this.citySearchText = nextSearchText;
    this.citySearchTextSubject.next(nextSearchText);
  }
}
