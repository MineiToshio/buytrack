type SortableDate = string | number | Date | null | undefined;
type SortableText = string | null | undefined;

export const sortDates = (a: SortableDate, b: SortableDate) =>
  new Date(a ?? 0).getTime() - new Date(b ?? 0).getTime();

export const sortNumbers = (a: number, b: number) => a - b;

export const sortText = (a: SortableText, b: SortableText) => {
  const textA = a ?? "";
  const textB = b ?? "";
  if (textA > textB) return 1;
  if (textA < textB) return -1;
  return 0;
};

export const sortBooleans = (a: boolean, b: boolean) =>
  a === b ? 0 : a ? -1 : 1;
