import { Pipe, PipeTransform } from '@angular/core';
import { Money } from '@app/models/money';

@Pipe({ name: 'moneyAmount', pure: true, standalone: true })
export class MoneyAmountPipe implements PipeTransform {
  transform(input: Money): number {
    return input.toView();
  }
}
