import { SofValidatorFn } from './validator.types';

export function required(): SofValidatorFn {
  return (value: unknown) => {
    if (value == null) return { required: true };
    if (typeof value === 'string' && value.trim() === '') return { required: true };
    if (Array.isArray(value) && value.length === 0) return { required: true };
    return null;
  };
}
