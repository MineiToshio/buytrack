import {
  Country,
  Currency,
  Delivery,
  Order,
  OrderNote,
  OrderPayment,
  OrderProduct,
  PrismaClient,
  ProductType,
  ProductsCountry,
  Store,
} from "@prisma/client";
import {
  DefaultArgs,
  PrismaClientOptions,
} from "@prisma/client/runtime/library";

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

export type OrderWithProducts = Order & {
  products: OrderProduct[];
};

export type OrderProductFull = OrderProduct & {
  order: Order;
};

export type DeliveryFull = Delivery & {
  orderProducts: OrderProduct[];
  currency: Currency;
  store: Store;
};

export type Transaction = Omit<
  PrismaClient<PrismaClientOptions, never, DefaultArgs>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;
