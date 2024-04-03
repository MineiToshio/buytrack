import { DeliveryFormType } from "./DeliveryForm";

export const formatDeliveryFormData = (
  data: DeliveryFormType,
  currencyId: string,
  deliveryId?: string,
) => ({
  deliveryId,
  ...data,
  ...(data.approximateDeliveryDate?.min && {
    minApproximateDeliveryDate: data.approximateDeliveryDate?.min,
  }),
  ...(data.approximateDeliveryDate?.max && {
    maxApproximateDeliveryDate: data.approximateDeliveryDate?.max,
  }),
  currencyId,
});
