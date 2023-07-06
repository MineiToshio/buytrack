import { Locale } from "@/types/types";

export const generateId = (length: number) => {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const formatDate = (date: Date, lang: Locale = "es") => {
  const day = date.getDate().toString();
  const month = (date.getMonth() + 1).toString();
  const year = date.getFullYear().toString();

  const formattedDay = `${day.length === 1 ? "0" : ""}${day}`;
  const formattedMonth = `${month.length === 1 ? "0" : ""}${month}`;

  switch (lang) {
    case "es":
      return `${formattedDay}/${formattedMonth}/${year}`;
    case "en":
    default:
      return `${formattedMonth}/${formattedDay}/${year}`;
  }
};
