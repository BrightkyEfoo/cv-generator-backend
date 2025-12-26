import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../shared/errors/index.js';

type ValidationSchema = {
  body?: Record<string, FieldValidator>;
  params?: Record<string, FieldValidator>;
  query?: Record<string, FieldValidator>;
};

type FieldValidator = {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: unknown[];
};

function validateField(value: unknown, validator: FieldValidator, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    if (validator.required) {
      throw new ValidationError(`${fieldName} is required`);
    }
    return;
  }

  const typeValidators: Record<string, () => boolean> = {
    string: () => typeof value === 'string',
    number: () => typeof value === 'number' && !isNaN(value),
    boolean: () => typeof value === 'boolean',
    array: () => Array.isArray(value),
    object: () => typeof value === 'object' && !Array.isArray(value),
  };

  if (!typeValidators[validator.type]()) {
    throw new ValidationError(`${fieldName} must be of type ${validator.type}`);
  }

  if (validator.type === 'string' && typeof value === 'string') {
    if (validator.minLength && value.length < validator.minLength) {
      throw new ValidationError(`${fieldName} must be at least ${validator.minLength} characters`);
    }
    if (validator.maxLength && value.length > validator.maxLength) {
      throw new ValidationError(`${fieldName} must be at most ${validator.maxLength} characters`);
    }
    if (validator.pattern && !validator.pattern.test(value)) {
      throw new ValidationError(`${fieldName} has invalid format`);
    }
  }

  if (validator.type === 'number' && typeof value === 'number') {
    if (validator.min !== undefined && value < validator.min) {
      throw new ValidationError(`${fieldName} must be at least ${validator.min}`);
    }
    if (validator.max !== undefined && value > validator.max) {
      throw new ValidationError(`${fieldName} must be at most ${validator.max}`);
    }
  }

  if (validator.enum && !validator.enum.includes(value)) {
    throw new ValidationError(`${fieldName} must be one of: ${validator.enum.join(', ')}`);
  }
}

export function validateRequest(schema: ValidationSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schema.body) {
        for (const [field, validator] of Object.entries(schema.body)) {
          validateField(req.body[field], validator, field);
        }
      }

      if (schema.params) {
        for (const [field, validator] of Object.entries(schema.params)) {
          validateField(req.params[field], validator, field);
        }
      }

      if (schema.query) {
        for (const [field, validator] of Object.entries(schema.query)) {
          validateField(req.query[field], validator, field);
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
