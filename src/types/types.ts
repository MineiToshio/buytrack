export type Locale = "es" | "en";

export type DateRange = null | {
  min: Date;
  max: Date;
};

export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const isMonthNumber = (n: number): n is MonthNumber => n >= 1 && n <= 12;
