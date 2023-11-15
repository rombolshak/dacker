import { Identifiable } from '@app/models/identifiable';
import { TuiDay } from '@taiga-ui/cdk';
import { Money } from '@app/models/money';
import { OperationType } from '@app/models/operation.data';

export class OperationData2 implements Identifiable {
  version = '2';

  constructor(
    public readonly id: string,
    public readonly date: TuiDay,
    public readonly type: OperationType,
    public readonly money: Money,
    public readonly memo: string | null,
  ) {}
}
