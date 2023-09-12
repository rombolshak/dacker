import { TuiDay } from '@taiga-ui/cdk';

export interface AccountTableData {
  name: string;
  bank: string;
  openedAt: TuiDay;
  duration: number | null;
  closingAt: TuiDay | null;
  interestScheduleDescription: {
    repeatType: string;
    repeatDay: string;
    capitalization: string;
    basis: string;
  };
  additionalInfo: {
    canWithdraw: string;
    canContribute: string;
  };
}
