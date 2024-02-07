import { TuiDay } from '@taiga-ui/cdk';

export interface AccountTableData {
  id: string;
  name: string;
  bank: string;
  openedAt: TuiDay;
  duration: number | null;
  closingAt: TuiDay | null;
  hasPendingTransactions: boolean;
  moneyInfo: {
    currentAmount: number;
    profitAmount: number;
    profitRate: string;
    totalProfit: number;
    rate: string;
  };
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
