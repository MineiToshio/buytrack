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

export const addLeadingZeros = (number: number, lenght: number = 2) => {
  const pad_char = "0";
  const pad = new Array(1 + lenght).join(pad_char);
  return (pad + number.toString()).slice(-pad.length);
};

export const formatDate = (date: Date, lang: Locale = "es") => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDay = addLeadingZeros(day);
  const formattedMonth = addLeadingZeros(month);

  switch (lang) {
    case "es":
      return `${formattedDay}/${formattedMonth}/${year}`;
    case "en":
    default:
      return `${formattedMonth}/${formattedDay}/${year}`;
  }
};

export const formatTime = (date: Date) => {
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const formattedHour = addLeadingZeros(hour);
  const formattedMinutes = addLeadingZeros(minutes);
  const formattedSeconds = addLeadingZeros(seconds);

  return `${formattedHour}:${formattedMinutes}:${formattedSeconds}`;
};

export const formatDatetime = (date: Date, lang: Locale = "es") =>
  `${formatDate(date, lang)} ${formatTime(date)}`;
