import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
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
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    AutocompleteDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
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

  readonly agentDisplayWith = (item: AgentOption | Agent): string => {
    if ('surname' in item) {
      return `${item.name} ${item.surname}`;
    }

    return item.name;
  };

  readonly agentValueEmpty = (item: Agent | null): boolean => !item?.id;
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
              this.agentDisplayWith(item).toLowerCase().includes(normalizedSearch),
            )
          : this.agentOptions,
      ).pipe(delay(Math.floor(Math.random() * 501))),
    ),
  );

  handleAgentValueChange(value: Agent | null): void {
    this.selectedAgent = value;
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

  readonly cityDisplayWith = (id: string): string => {
    return this.cityOptions.find((option) => option.id === id)?.name ?? id;
  };

  readonly cityValueEmpty = (id: string | null): boolean => !id;
  readonly cityCompareWith = (id: string | null, optionId: string): boolean => id === optionId;

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

  handleCityValueChange(value: string | null): void {
    this.selectedCityId = value;
  }

  handleCitySearchTextChange(value: string | null | undefined): void {
    const nextSearchText = value ?? '';
    this.citySearchText = nextSearchText;
    this.citySearchTextSubject.next(nextSearchText);
  }
}
