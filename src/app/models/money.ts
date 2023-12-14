export class Money {
  constructor(public readonly amount: number) {
    this.amount = Math.round(this.amount);
  }

  toView(): number {
    return this.amount / 100;
  }

  static fromView(value: number): Money {
    return new Money(Math.round(value * 100));
  }

  static zero: Money = new Money(0);

  add(other: Money): Money {
    return new Money(this.amount + other.amount);
  }

  getProfit(rate: number, normalizedDuration: number): Money {
    return new Money(((this.amount * rate) / 100) * normalizedDuration);
  }

  isNegative(): boolean {
    return this.amount < 0;
  }

  toPositive(): Money {
    if (this.isNegative()) return new Money(-this.amount);
    return this;
  }

  toNegative(): Money {
    if (this.isNegative()) return this;
    return new Money(-this.amount);
  }

  valueOf(): number {
    return this.amount;
  }
}
