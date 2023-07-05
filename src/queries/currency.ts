import { db } from "@/helpers/db";
import { Currency } from "@prisma/client";

export const getCurrencies = () =>
  db.currency.findMany({ orderBy: { name: "asc" } });

export const getCurrencyById = (id: string) =>
  db.currency.findFirst({ where: { id } });

export const getCurrencyByName = (name: string) =>
  db.currency.findFirst({ where: { name } });

export const createCurrency = (currency: Omit<Currency, "id">) =>
  db.currency.create({
    data: currency,
  });
