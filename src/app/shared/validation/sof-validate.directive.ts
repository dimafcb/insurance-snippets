import { Directive, HostListener, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { SofValidationErrors, SofValidatorFn } from './validator.types';

interface FormFieldControlWithErrorState {
  updateErrorState?(): void;
}

class SofErrorStateMatcher implements ErrorStateMatcher {
  directive: SofValidateDirective | null = null;

  isErrorState(): boolean {
    return this.directive?.showErrors ?? false;
  }
}

@Directive({
  selector: '[ngModel][sofValidators]',
  exportAs: 'sofValidators',
  standalone: true,
  providers: [{ provide: ErrorStateMatcher, useFactory: () => new SofErrorStateMatcher() }],
})
export class SofValidateDirective implements OnInit, OnDestroy {
  @Input('sofValidators') validators: SofValidatorFn[] = [];

  private readonly ngModel = inject(NgModel);
  private readonly formFieldControl = inject(MatFormFieldControl, {
    optional: true,
    self: true,
  }) as FormFieldControlWithErrorState | null;
  private readonly subscription = new Subscription();

  errors: SofValidationErrors = {};
  touched = false;

  get valid(): boolean {
    return Object.keys(this.errors).length === 0;
  }

  get invalid(): boolean {
    return !this.valid;
  }

  get showErrors(): boolean {
    return this.touched && this.invalid;
  }

  constructor() {
    const matcher = inject(ErrorStateMatcher) as SofErrorStateMatcher;
    matcher.directive = this;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.ngModel.valueChanges?.subscribe(() => {
        this.runValidation();
        this.refreshErrorState();
      }),
    );
    this.runValidation();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('blur')
  onBlur(): void {
    this.markAsTouched();
  }

  markAsTouched(): void {
    this.touched = true;
    this.refreshErrorState();
  }

  validate(): boolean {
    this.touched = true;
    this.runValidation();
    this.refreshErrorState();
    return this.valid;
  }

  private runValidation(): void {
    const value = this.ngModel.control.value;
    this.errors = this.validators.reduce<SofValidationErrors>((acc, fn) => {
      const result = fn(value);
      return result ? { ...acc, ...result } : acc;
    }, {});
  }

  private refreshErrorState(): void {
    this.formFieldControl?.updateErrorState?.();
  }
}
