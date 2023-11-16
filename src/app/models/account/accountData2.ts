import { Identifiable } from '@app/models/identifiable';
import { TuiDay } from '@taiga-ui/cdk';
import { Money } from '@app/models/money';
import { InterestBase, RepeatOption } from '@app/models/account.data';

type MoneyStepRate2 = { money: Money; rate: number };
export type MonthInterest2 = { month: number; rates: readonly MoneyStepRate2[] };
type AccountInterest2 = readonly MonthInterest2[];
type InterestSchedule = { type: RepeatOption; day: number | null; isCapitalizing: boolean };

export class AccountData2 implements Identifiable {
  version = '2';

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly bank: string,
    public readonly openedAt: TuiDay,
    public readonly duration: number | null,
    public readonly interest: AccountInterest2,
    public readonly canWithdraw: boolean,
    public readonly canContribute: boolean,
    public readonly interestSchedule: InterestSchedule,
    public readonly interestBase: InterestBase,
  ) {}
}
