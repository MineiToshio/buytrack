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

export const formatDate = (date: Date | string, lang: Locale = "es") => {
  const currentDate = new Date(date);
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

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

export const formatTime = (date: Date | string) => {
  const currentDate = new Date(date);
  const hour = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  const formattedHour = addLeadingZeros(hour);
  const formattedMinutes = addLeadingZeros(minutes);
  const formattedSeconds = addLeadingZeros(seconds);

  return `${formattedHour}:${formattedMinutes}:${formattedSeconds}`;
};

export const formatDatetime = (date: Date | string, lang: Locale = "es") =>
  `${formatDate(date, lang)} ${formatTime(date)}`;

export const pushState = (params: string) =>
  window.history.pushState({}, "", window.location.pathname + "?" + params);
