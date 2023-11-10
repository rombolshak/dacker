export class Money {
  constructor(public readonly amount: number) {}

  toView(): number {
    return this.amount / 100;
  }

  static fromView(value: number): Money {
    return new Money(Math.round(value * 100));
  }

  static zero: Money = new Money(0);

  add(other: Money | number): Money {
    if (typeof other === 'number') return new Money(this.amount + other);
    return new Money(this.amount + other.amount);
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
}
