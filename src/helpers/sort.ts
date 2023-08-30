type CastableDate = string | number | Date | null | undefined;

export const sortDates = (a: CastableDate, b: CastableDate) =>
  new Date(a ?? 0).getTime() - new Date(b ?? 0).getTime();

export const sortNumbers = (a: number, b: number) => a - b;

export const sortText = (a: string, b: string) => {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
};
