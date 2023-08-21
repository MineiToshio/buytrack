import { OrderStatus, StoreType } from "@prisma/client";

export const storeTypeLabel = Object.freeze({
  [StoreType.Business]: "Negocio",
  [StoreType.Person]: "Persona",
});

export const storeTypeOptions = Object.entries(storeTypeLabel).map(
  ([value, label]) => ({
    label,
    value,
  }),
);

export const orderStatusLabel = Object.freeze({
  [OrderStatus.Canceled]: "Cancelado",
  [OrderStatus.Delivered]: "Entregado",
  [OrderStatus.In_Route]: "En Ruta",
  [OrderStatus.Open]: "Abierto",
  [OrderStatus.Partial_Delivered]: "Entrega Parcial",
  [OrderStatus.Partial_In_Route]: "En Ruta Parcial",
});

export const orderStatusColor = Object.freeze({
  [OrderStatus.Canceled]: "error",
  [OrderStatus.Delivered]: "primary",
  [OrderStatus.In_Route]: "secondary",
  [OrderStatus.Open]: "muted",
  [OrderStatus.Partial_Delivered]: "secondary",
  [OrderStatus.Partial_In_Route]: "secondary",
});

export const deliveryStatus = {
  noDelivery: "0",
  delivered: "1",
  inRoute: "2",
};

export const deliveryStatusData = Object.freeze({
  [deliveryStatus.noDelivery]: Object.freeze({
    label: "Sin Entrega",
    color: "muted",
  }),
  [deliveryStatus.delivered]: Object.freeze({
    label: "Entregado",
    color: "primary",
  }),
  [deliveryStatus.inRoute]: Object.freeze({
    label: "En Ruta",
    color: "secondary",
  }),
});
