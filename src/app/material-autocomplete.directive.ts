import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
  inject,
} from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { Subscription } from 'rxjs';

type TypedComponentChanges<T> = {
  [P in keyof T]?: {
    previousValue: T[P];
    currentValue: T[P];
    firstChange: boolean;
  };
} & SimpleChanges;

@Directive({
  selector: 'input[matAutocomplete][sofMaterialAutocomplete]',
  exportAs: 'sofMaterialAutocomplete',
  standalone: true,
})
export class AutocompleteDirective<
  T extends string | object = object,
  O extends string | object = object,
>
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input() selectedValue: T | null = null;
  @Input() searchText: string | null | undefined = '';
  @Input({ required: true }) isValueEmptyFn!: (value: T | null) => boolean;
  @Input({ required: true }) displayWith!: (value: T | O) => string;
  @Input({ required: true }) compareWith!: (value: T | null, optionValue: O) => boolean;

  @Output() readonly selectedValueChange = new EventEmitter<T | null>();
  @Output() readonly searchTextChange = new EventEmitter<string>();

  noSuggestions = false;

  get isSearching(): boolean {
    return this.isFocused;
  }

  get canClear(): boolean {
    return (
      !this.isValueEmptyFn(this.selectedValue) || !this.isSearchTextEmpty || this.inputHasValue
    );
  }

  get inputValue(): string {
    return this.elementRef.nativeElement?.value ?? '';
  }

  get inputHasValue(): boolean {
    return this.inputValue !== '';
  }

  get normalizedSearchText(): string {
    return this.searchText ?? '';
  }

  get isSearchTextEmpty(): boolean {
    return this.normalizedSearchText === '';
  }

  private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly autocompleteTrigger = inject(MatAutocompleteTrigger);
  private readonly subscription = new Subscription();

  private isNoSuggestionsRefreshScheduled = false;
  private isFocused = false;
  private ignoreNextFocus = false;
  private justSelectedOption = false;

  ngAfterViewInit(): void {
    this.syncAutocomplete();
    this.scheduleNoSuggestionsRefresh();
    this.syncInputValue();
  }

  ngOnChanges(changes: TypedComponentChanges<AutocompleteDirective<T>>): void {
    if (!changes.selectedValue && !changes.searchText) {
      return;
    }

    this.scheduleNoSuggestionsRefresh();

    if (!this.isFocused) {
      this.syncInputValue();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('input', ['$event'])
  handleInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement | null)?.value ?? '';

    this.emitSearchTextChange(inputValue);
  }

  @HostListener('focusin')
  handleFocus(): void {
    this.isFocused = true;

    if (this.ignoreNextFocus) {
      this.ignoreNextFocus = false;
      return;
    }

    this.setInputValue('');
    this.emitSearchTextChange('');
  }

  @HostListener('focusout')
  handleBlur(): void {
    if (this.autocompleteTrigger.panelOpen && this.hasSelectableOption()) {
      return;
    }

    this.isFocused = false;
    this.emitSearchTextChange('');
    this.syncInputValue();
  }

  clear(event?: MouseEvent): void {
    event?.preventDefault();
    event?.stopPropagation();

    this.clearSelectedOptions();
    this.selectedValueChange.emit(null);
    this.emitSearchTextChange('');
    this.setInputValue('');
  }

  private syncAutocomplete(): void {
    const autocomplete = this.autocompleteTrigger.autocomplete;
    if (!autocomplete) {
      return;
    }

    this.setDisplayWith(autocomplete);
    this.subscription.add(
      autocomplete.opened.subscribe(() => {
        this.syncSelectedOption();
        this.scheduleNoSuggestionsRefresh();
      }),
    );
    this.subscription.add(
      autocomplete.options.changes.subscribe(() => {
        this.syncSelectedOption();
        this.scheduleNoSuggestionsRefresh();
      }),
    );
    this.subscription.add(
      autocomplete.closed.subscribe(() => {
        if (this.justSelectedOption) {
          this.justSelectedOption = false;
          return;
        }

        if (!this.isFocused) {
          return;
        }

        this.isFocused = false;
        this.emitSearchTextChange('');
        this.syncInputValue();
      }),
    );
    this.subscription.add(
      autocomplete.optionSelected.subscribe((selection) => {
        const value = selection.option.value as T | null;

        this.ignoreNextFocus = true;
        this.justSelectedOption = true;
        this.selectedValueChange.emit(value);
        this.emitSearchTextChange('');
        this.setInputValue(this.getValueDisplayText(value));
        this.scheduleNoSuggestionsRefresh();
      }),
    );
  }

  private setDisplayWith(autocomplete: MatAutocompleteTrigger['autocomplete']): void {
    if (!autocomplete) {
      return;
    }

    autocomplete.displayWith = this.displayWith ?? null;
  }

  private syncSelectedOption(): void {
    const autocomplete = this.autocompleteTrigger.autocomplete;
    if (!autocomplete) {
      return;
    }

    autocomplete.options.forEach((option) => this.syncOptionSelection(option));
  }

  private syncOptionSelection(option: MatOption<O>): void {
    if (option.value == null) {
      if (option.selected) {
        option.deselect(false);
      }

      return;
    }

    const shouldSelect = this.compareWith(this.selectedValue, option.value);

    if (shouldSelect && !option.selected) {
      option.select(false);
      return;
    }

    if (!shouldSelect && option.selected) {
      option.deselect(false);
    }
  }

  private clearSelectedOptions(): void {
    const autocomplete = this.autocompleteTrigger.autocomplete;
    if (!autocomplete) {
      return;
    }

    autocomplete.options.forEach((option) => {
      if (option.selected) {
        option.deselect(false);
      }
    });
  }

  private getValueDisplayText(value: T | null = this.selectedValue): string {
    if (value == null) {
      return '';
    }

    return this.displayWith(value);
  }

  private computeDisplayedInputValue(): string {
    if (this.isFocused && !this.isSearchTextEmpty) {
      return this.normalizedSearchText;
    }

    if (this.isFocused) {
      return '';
    }

    return this.getValueDisplayText();
  }

  private syncInputValue(): void {
    this.setInputValue(this.computeDisplayedInputValue());
  }

  private setInputValue(value: string): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
  }

  private emitSearchTextChange(value: string): void {
    this.searchTextChange.emit(value);
    this.scheduleNoSuggestionsRefresh();
  }

  private scheduleNoSuggestionsRefresh(): void {
    if (this.isNoSuggestionsRefreshScheduled) {
      return;
    }

    this.isNoSuggestionsRefreshScheduled = true;
    queueMicrotask(() => {
      this.isNoSuggestionsRefreshScheduled = false;
      this.refreshNoSuggestions();
    });
  }

  private refreshNoSuggestions(): void {
    this.noSuggestions = !this.hasSelectableOption();
  }

  private hasSelectableOption(): boolean {
    const options = this.autocompleteTrigger.autocomplete?.options?.toArray() ?? [];
    return options.some((option) => !option.disabled);
  }
}
