import { Country, ProductType, ProductsCountry, Store } from "@prisma/client";

export type StoreFull = Store & {
  country: Country;
  productTypes?: {
    productType: ProductType;
  }[];
  productsCountry?: {
    country: ProductsCountry;
  }[];
};
