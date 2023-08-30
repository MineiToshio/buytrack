import { deliveryStatus } from "@/helpers/constants";

export const getStatusAttribute = (isDelivered?: boolean) => {
  if (isDelivered == null) return deliveryStatus.noDelivery;
  else if (isDelivered) return deliveryStatus.delivered;
  else return deliveryStatus.inRoute;
};
