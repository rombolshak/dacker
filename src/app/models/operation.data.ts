import { Identifiable } from '@app/models/identifiable';

export interface OperationData extends Identifiable {
  type: string;
}
