import { db } from "@/helpers/db";
import { ProductsCountry } from "@prisma/client";

export const getProductsCountries = () =>
  db.productsCountry.findMany({ orderBy: { name: "asc" } });

export const getProductsCountryById = (id: string) =>
  db.productsCountry.findFirst({ where: { id } });

export const getProductsCountryByName = (name: string) =>
  db.productsCountry.findFirst({ where: { name } });

export const createProductsCountry = (
  productsCountry: Omit<ProductsCountry, "id">
) =>
  db.productsCountry.create({
    data: productsCountry,
  });
