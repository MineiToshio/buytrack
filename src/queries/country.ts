import { db } from "@/helpers/db";
import { Country } from "@prisma/client";

export const getCountries = () =>
  db.country.findMany({ orderBy: { name: "asc" } });

export const getCountryById = (id: string) =>
  db.country.findFirst({ where: { id } });

export const getCountryByName = (name: string) =>
  db.country.findFirst({ where: { name } });

export const createCountry = (country: Omit<Country, "id">) =>
  db.country.create({
    data: country,
  });
