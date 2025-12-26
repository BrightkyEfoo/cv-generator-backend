import type { CV, Template, Payment } from '../../domain/entities/index.js';

class InMemoryStore {
  private cvs: Map<string, CV> = new Map();
  private templates: Map<string, Template> = new Map();
  private payments: Map<string, Payment> = new Map();

  getCVs(): Map<string, CV> {
    return this.cvs;
  }

  getTemplates(): Map<string, Template> {
    return this.templates;
  }

  getPayments(): Map<string, Payment> {
    return this.payments;
  }

  clear(): void {
    this.cvs.clear();
    this.templates.clear();
    this.payments.clear();
  }
}

export const store = new InMemoryStore();
