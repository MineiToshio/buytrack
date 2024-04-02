import { OrderFormType } from "./OrderForm";

export const formatOrderFormData = (
  data: OrderFormType,
  currencyId: string,
  orderId?: string,
) => ({
  ...(orderId && { orderId }),
  storeId: data.storeId,
  productsCost: data.productsCost,
  ...(data.orderDate && { orderDate: new Date(data.orderDate) }),
  ...(data.approximateDeliveryDate?.min && {
    minApproximateDeliveryDate: data.approximateDeliveryDate?.min,
  }),
  ...(data.approximateDeliveryDate?.max && {
    maxApproximateDeliveryDate: data.approximateDeliveryDate?.max,
  }),
  currencyId,
  products: data.products.map((p) => ({
    productName: p.productName,
    ...(p.price && { price: p.price }),
    ...(p.productId && { id: p.productId }),
  })),
});
