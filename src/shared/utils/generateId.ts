import { v4 as uuidv4 } from 'uuid';

export function generateId(): string {
  return uuidv4();
}

export function generateSessionId(): string {
  return `session_${uuidv4()}`;
}

export function generateCvId(): string {
  return `cv_${uuidv4()}`;
}

export function generatePaymentId(): string {
  return `pay_${uuidv4()}`;
}
