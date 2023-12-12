import { TuiDay } from '@taiga-ui/cdk';

export function normalizedDuration(from: TuiDay, to: TuiDay): number {
  if (to.year === from.year) return TuiDay.lengthBetween(from, to) / daysInYear(to.isLeapYear);
  if (to.isLeapYear === from.isLeapYear) return TuiDay.lengthBetween(from, to) / daysInYear(to.isLeapYear);
  const newYear = TuiDay.normalizeOf(to.year, 0, 1);
  return (
    TuiDay.lengthBetween(from, newYear) / daysInYear(from.isLeapYear) +
    TuiDay.lengthBetween(newYear, to) / daysInYear(to.isLeapYear)
  );
}

const daysInYear: (isLeapYear: boolean) => number = isLeapYear => (isLeapYear ? 366 : 365);
