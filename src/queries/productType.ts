import { db } from "@/helpers/db";
import { ProductType } from "@prisma/client";

export const getProductTypes = () =>
  db.productType.findMany({ orderBy: { name: "asc" } });

export const getProductTypeById = (id: string) =>
  db.productType.findFirst({ where: { id } });

export const getProductTypeByName = (name: string) =>
  db.productType.findFirst({ where: { name } });

export const createProductType = (productType: Omit<ProductType, "id">) =>
  db.productType.create({
    data: productType,
  });
