import Icons from "@/components/core/Icons";
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
  [OrderStatus.Open]: "Abierto",
  [OrderStatus.Partial_In_Route]: "En Ruta Parcial",
  [OrderStatus.In_Route]: "En Ruta",
  [OrderStatus.Partial_Delivered]: "Entrega Parcial",
  [OrderStatus.Delivered]: "Entregado",
  [OrderStatus.Canceled]: "Cancelado",
});

export const orderStatusColor = Object.freeze({
  [OrderStatus.Open]: "muted",
  [OrderStatus.Partial_In_Route]: "secondary-alt",
  [OrderStatus.In_Route]: "secondary",
  [OrderStatus.Partial_Delivered]: "primary-alt",
  [OrderStatus.Delivered]: "primary",
  [OrderStatus.Canceled]: "error",
});

export const orderStatusOrder = Object.freeze({
  [OrderStatus.Open]: 1,
  [OrderStatus.Partial_In_Route]: 2,
  [OrderStatus.In_Route]: 3,
  [OrderStatus.Partial_Delivered]: 4,
  [OrderStatus.Delivered]: 5,
  [OrderStatus.Canceled]: 6,
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
    icon: Icons.NoDelivery,
    order: 1,
  }),
  [deliveryStatus.delivered]: Object.freeze({
    label: "Entregado",
    color: "primary",
    icon: Icons.Delivered,
    order: 3,
  }),
  [deliveryStatus.inRoute]: Object.freeze({
    label: "En Ruta",
    color: "secondary",
    icon: Icons.Courier,
    order: 2,
  }),
});

export enum FormState {
  create,
  edit,
  view,
}

export const abbreviatedMonthNames = {
  1: "ENE",
  2: "FEB",
  3: "MAR",
  4: "ABR",
  5: "MAY",
  6: "JUN",
  7: "JUL",
  8: "AGO",
  9: "SET",
  10: "OCT",
  11: "NOV",
  12: "DIC",
};
