import { ValidationError } from '../errors/index.js';

export function validateRequired<T>(value: T | undefined | null, fieldName: string): T {
  if (value === undefined || value === null || value === '') {
    throw new ValidationError(`${fieldName} is required`);
  }
  return value;
}

export function validateEmail(email: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
  return email.toLowerCase().trim();
}

export function validateUrl(url: string): string {
  try {
    new URL(url);
    return url;
  } catch {
    throw new ValidationError('Invalid URL format');
  }
}

export function validateHexColor(color: string): string {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexRegex.test(color)) {
    throw new ValidationError('Invalid hex color format');
  }
  return color;
}

export function validateDateString(date: string): string {
  const dateRegex = /^\d{4}-\d{2}(-\d{2})?$/;
  if (!dateRegex.test(date)) {
    throw new ValidationError('Invalid date format. Use YYYY-MM or YYYY-MM-DD');
  }
  return date;
}

export function validateArrayNotEmpty<T>(array: T[], fieldName: string): T[] {
  if (!Array.isArray(array) || array.length === 0) {
    throw new ValidationError(`${fieldName} must have at least one item`);
  }
  return array;
}

export function validateStringLength(
  value: string,
  fieldName: string,
  min: number = 0,
  max: number = Infinity
): string {
  if (value.length < min) {
    throw new ValidationError(`${fieldName} must be at least ${min} characters`);
  }
  if (value.length > max) {
    throw new ValidationError(`${fieldName} must be at most ${max} characters`);
  }
  return value;
}

export function validateNumber(
  value: number,
  fieldName: string,
  min: number = -Infinity,
  max: number = Infinity
): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError(`${fieldName} must be a valid number`);
  }
  if (value < min || value > max) {
    throw new ValidationError(`${fieldName} must be between ${min} and ${max}`);
  }
  return value;
}
