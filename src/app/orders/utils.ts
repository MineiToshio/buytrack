import { deliveryStatus } from "@/helpers/constants";
import { OrderFormType } from "./OrderForm";

export const getStatusAttribute = (isDelivered?: boolean) => {
  if (isDelivered == null) return deliveryStatus.noDelivery;
  else if (isDelivered) return deliveryStatus.delivered;
  else return deliveryStatus.inRoute;
};

export const formatOrderFormData = (data: OrderFormType, orderId?: string) => ({
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
  currencyId: data.currencyId,
  products: data.products.map((p) => ({
    productName: p.productName,
    ...(p.price && { price: p.price }),
    ...(p.productId && { id: p.productId }),
  })),
});
