import { Identifiable } from '@app/model/identifiable';

export interface OperationData extends Identifiable {
  type: string;
}
