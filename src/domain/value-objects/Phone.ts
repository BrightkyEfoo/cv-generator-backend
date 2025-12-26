export class Phone {
  private readonly value: string;

  private constructor(phone: string) {
    this.value = phone;
  }

  static create(phone: string): Phone {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    if (cleaned.length < 8 || cleaned.length > 15) {
      throw new Error('Invalid phone number length');
    }
    return new Phone(cleaned);
  }

  getValue(): string {
    return this.value;
  }

  getFormatted(): string {
    return this.value;
  }
}
