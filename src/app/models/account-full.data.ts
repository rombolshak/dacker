import { Identifiable } from '@app/models/identifiable';

export interface AccountFullData extends Identifiable {
  currentAmount: number;
}
