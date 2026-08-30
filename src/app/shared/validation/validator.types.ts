export type SofValidationErrors = Record<string, unknown>;

export type SofValidatorFn = (value: unknown) => SofValidationErrors | null;
