import {
  Country,
  Currency,
  Delivery,
  Order,
  OrderNote,
  OrderPayment,
  OrderProduct,
  ProductType,
  ProductsCountry,
  Store,
} from "@prisma/client";

export type StoreFull = Store & {
  country: Country;
  productTypes?: {
    productType: ProductType;
  }[];
  productsCountry?: {
    country: ProductsCountry;
  }[];
};

export type OrderFull = Order & {
  products: (OrderProduct & {
    delivery: Delivery | null;
  })[];
  orderNotes: OrderNote[];
  orderPayments: OrderPayment[];
  store: Store;
  currency: Currency;
  paidAmount: number;
};
