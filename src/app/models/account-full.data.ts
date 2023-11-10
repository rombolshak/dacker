import { Identifiable } from '@app/models/identifiable';
import { Money } from '@app/models/money';

export interface AccountFullData extends Identifiable {
  currentMoney: Money;
  receivedProfit: Money;
  rate: number;
}
