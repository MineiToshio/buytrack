export const getStatusAttribute = (isDelivered?: boolean) => {
  if (isDelivered == null) return 0;
  else if (isDelivered) return 1;
  else return 2;
};
