"use client";

import Button from "@/core/Button";
import DatePicker from "@/core/DatePicker";
import Icons from "@/core/Icons";
import Typography from "@/core/Typography";
import {
  CREATE_CURRENCY,
  DELETE_DELIVERY,
  GET_CURRENCY,
  UPDATE_DELIVERY,
} from "@/helpers/apiUrls";
import { del, put } from "@/helpers/request";
import useSelect, { formatOptions } from "@/hooks/useSelect";
import ConfirmModal from "@/modules/ConfirmModal";
import FormRow from "@/modules/FormRow";
import Modal from "@/modules/Modal";
import { cn } from "@/styles/utils";
import { DeliveryFull, OrderWithProducts } from "@/types/prisma";
import { Currency, Store } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FC, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import DeliveryProducts from "./DeliveryProducts";
import { formatDate } from "@/helpers/utils";

const DEFAULT_DELIVERY_DATE = {
  value: new Date(),
  error: false,
};

const DELIVERED_CHIP_DATA = Object.freeze({
  1: Object.freeze({
    label: "Entregado",
    color: "primary",
  }),
  2: Object.freeze({
    label: "En Camino",
    color: "muted",
  }),
});

export type DeliveryFormType = {
  storeId: string;
  currencyId: string;
  price: number;
  currier?: string;
  tracking?: string;
  approximateDeliveryDate: {
    min?: Date;
    max?: Date;
  };
  products: string[];
};

type DeliveryFormProps = {
  defaults?: {
    storeId?: string | null;
    orderId?: string | null;
  };
  stores: Store[];
  orders: OrderWithProducts[];
  delivery?: DeliveryFull | null;
  isLoading?: boolean;
  onSubmit: (data: DeliveryFormType) => void;
};

const deleteDelivery = (deliveryId: string) =>
  del(`${DELETE_DELIVERY}${deliveryId}`);

const updateToDelivered = (deliveryId: string, deliveryDate: Date) =>
  put(UPDATE_DELIVERY, { deliveryId, delivered: true, deliveryDate });

const DeliveryForm: FC<DeliveryFormProps> = ({
  defaults,
  stores,
  orders,
  delivery,
  isLoading,
  onSubmit,
}) => {
  const router = useRouter();
  const [isDelivered, setIsDelivered] = useState<boolean | undefined>(
    delivery?.delivered,
  );
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isDeleteMessageShowing, setIsDeleteMessageShowing] =
    useState<boolean>(false);
  const [showDeliveredMessage, setShowDeliveredMessage] =
    useState<boolean>(false);
  const [deliveryDate, setDeliveryDate] = useState<{
    value: Date | null;
    error: boolean;
  }>(DEFAULT_DELIVERY_DATE);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(!!delivery);
  const [ordersWithProducts, setOrdersWithProducts] = useState<
    OrderWithProducts[]
  >([]);

  const { isLoading: isDeleting, mutate: mutateDelete } = useMutation({
    mutationFn: (deliveryId: string) => deleteDelivery(deliveryId),
    onSuccess: () => {
      setIsPending(true);
      router.push("/deliveries");
      // This refresh is to force the await in /deliveries page
      router.refresh();
    },
  });

  const { mutate: mutateSetAdDelivered } = useMutation({
    mutationFn: ({
      deliveryId,
      deliveryDate,
    }: {
      deliveryId: string;
      deliveryDate: Date;
    }) => updateToDelivered(deliveryId, deliveryDate),
  });

  const storeOptions = formatOptions(stores);

  const { options: currencyOptions, addNewOption: addNewCurrency } =
    useSelect<Currency>(["currencies"], GET_CURRENCY, CREATE_CURRENCY);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DeliveryFormType>();

  const setProductsByStore = useCallback(
    (storeId: string) => {
      const currentOrders = orders.filter((p) => p.storeId === storeId);
      setOrdersWithProducts(currentOrders);
    },
    [orders],
  );

  useEffect(() => {
    if (delivery) {
      setValue("storeId", delivery.storeId);
      setValue("currencyId", delivery.currencyId);
      setValue("price", delivery.price);
      delivery.currier && setValue("currier", delivery.currier);
      delivery.tracking && setValue("tracking", delivery.tracking);
      if (
        delivery.minApproximateDeliveryDate &&
        delivery.maxApproximateDeliveryDate
      ) {
        setValue("approximateDeliveryDate", {
          min: delivery.minApproximateDeliveryDate,
          max: delivery.maxApproximateDeliveryDate,
        });
      }
      delivery.orderProducts &&
        setValue(
          "products",
          delivery.orderProducts.map((o) => o.id),
        );
    } else if (defaults) {
      if (defaults.storeId) {
        const storeExists = stores.find((s) => s.id === defaults.storeId);
        if (storeExists) {
          setValue("storeId", defaults.storeId);
          setProductsByStore(defaults.storeId);
        }
      }

      if (defaults.orderId) {
        const orderExists = orders.find(
          (o) => o.storeId === defaults.storeId && o.id === defaults.orderId,
        );
        if (orderExists) {
          const products = orderExists.products.map((p) => p.id);
          setValue("products", products);
        }
      }
    }
  }, [delivery, defaults, setValue, stores, orders, setProductsByStore]);

  const handleStoreChange = (storeId: string) => {
    setProductsByStore(storeId);
    setValue("products", []);
  };

  const toggleDeleteMessage = () => setIsDeleteMessageShowing((s) => !s);

  const showDeleteMessage = useCallback(() => {
    toggleDeleteMessage();
  }, []);

  const confirmDelete = () => {
    if (delivery) {
      toggleDeleteMessage();
      mutateDelete(delivery.id);
    }
  };

  const toggleDeliveryMessage = () => setShowDeliveredMessage((s) => !s);

  const openDeliveryMessage = () => {
    toggleDeliveryMessage();
    setDeliveryDate(DEFAULT_DELIVERY_DATE);
  };

  const onDeliveryDayChange = (value: Date | null) => {
    if (value) {
      setDeliveryDate({ value, error: false });
    } else {
      setDeliveryDate({ value, error: true });
    }
  };

  const confirmDelivery = () => {
    if (delivery && deliveryDate.value) {
      mutateSetAdDelivered({
        deliveryId: delivery.id,
        deliveryDate: deliveryDate.value,
      });
      setIsDelivered(true);
      toggleDeliveryMessage();
    }
  };

  return (
    <>
      <Modal open={showDeliveredMessage} onClose={toggleDeliveryMessage}>
        <div className="flex flex-col gap-y-4 p-4">
          <Typography>Selecciona la fecha de delivery</Typography>
          <DatePicker
            variant="standard"
            onChange={onDeliveryDayChange}
            value={deliveryDate.value}
            maxDate={new Date()}
            className={cn({ "border-error": deliveryDate.error })}
          />
          <div className="flex justify-end gap-x-2">
            <Button onClick={confirmDelivery}>Confirmar</Button>
            <Button
              color="muted"
              onClick={toggleDeliveryMessage}
              variant="outline"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
      <ConfirmModal
        open={isDeleteMessageShowing}
        message="¿Estás seguro de eliminar la entrega? Esta acción es permanente."
        onCancel={toggleDeleteMessage}
        onConfirm={confirmDelete}
      />
      <div className="flex flex-col gap-x-4 md:flex-row">
        <form
          className="flex w-full flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex w-full flex-col gap-x-4 md:flex-row">
            <div className="flex w-full flex-col md:w-3/5">
              {isDelivered != null && (
                <>
                  <FormRow
                    title="Estado"
                    Icon={Icons.Tag}
                    type="chip"
                    label={DELIVERED_CHIP_DATA[isDelivered ? "1" : "2"].label}
                    color={DELIVERED_CHIP_DATA[isDelivered ? "1" : "2"].color}
                  />
                  {isDelivered && (
                    <FormRow
                      title="Fecha de Entrega"
                      Icon={Icons.Calendar}
                      type="label"
                      label={formatDate(
                        delivery?.deliveryDate ?? deliveryDate.value ?? "",
                      )}
                    />
                  )}
                </>
              )}
              <FormRow
                title="Tienda"
                Icon={Icons.Store}
                placeholder="Selecciona una tienda"
                searchPlaceholder="Busca una tienda"
                type="select"
                options={storeOptions}
                control={control}
                formField="storeId"
                readOnly={isReadOnly}
                allowSearch
                required
                error={!!errors.storeId}
                errorMessage="La tienda es obligatoria"
                onChange={handleStoreChange}
              />
              {!(
                isReadOnly &&
                (delivery?.maxApproximateDeliveryDate == null ||
                  delivery?.minApproximateDeliveryDate == null)
              ) && (
                <FormRow
                  title="Fecha aprox. de entrega"
                  Icon={Icons.CalendarDays}
                  placeholder="Selecciona el rango de entrega"
                  type="dateRangePicker"
                  control={control}
                  formField="approximateDeliveryDate"
                  readOnly={isReadOnly}
                  minDate={new Date()}
                />
              )}
              {!(isReadOnly && delivery?.currier?.length === 0) && (
                <FormRow
                  title="Currier"
                  Icon={Icons.Currier}
                  placeholder="Olva, Rappi, Motorizado"
                  type="input"
                  readOnly={isReadOnly}
                  {...register("currier")}
                />
              )}
              {!(isReadOnly && delivery?.tracking?.length === 0) && (
                <FormRow
                  title="Tracking"
                  Icon={Icons.Currier}
                  placeholder="123456789"
                  type="input"
                  readOnly={isReadOnly}
                  {...register("tracking")}
                />
              )}
              <FormRow
                title="Moneda"
                Icon={Icons.Coins}
                placeholder="Elige el tipo de moneda"
                type="select"
                options={currencyOptions}
                control={control}
                formField="currencyId"
                newModalTitle="Nueva moneda"
                onAdd={addNewCurrency}
                required
                error={!!errors.currencyId}
                errorMessage="La moneda es obligatoria"
                readOnly={isReadOnly}
              />
              <FormRow
                title="Precio"
                Icon={Icons.Money}
                placeholder="1234"
                type="input"
                readOnly={isReadOnly}
                error={!!errors.price}
                errorMessage="El precio es obligatorio"
                min={0}
                {...register("price", { required: true, valueAsNumber: true })}
              />
            </div>
            <div className="mt-2 flex h-full w-full flex-col md:w-2/5">
              <Typography color="muted" className="mb-2">
                Productos
              </Typography>
              <div
                className={cn(
                  "flex h-full w-full flex-col overflow-y-auto rounded-md border p-2",
                  { "border-error": !!errors.products },
                )}
              >
                {isReadOnly ? (
                  <>
                    {delivery && (
                      <>
                        {delivery.orderProducts.map((p) => (
                          <Typography key={p.id}>{p.productName}</Typography>
                        ))}
                      </>
                    )}
                  </>
                ) : (
                  <Controller
                    name="products"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <DeliveryProducts
                        orders={ordersWithProducts}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="mt-5 flex gap-x-4">
            {!isReadOnly && (
              <Button type="submit" className="w-fit" isLoading={isLoading}>
                Guardar
              </Button>
            )}
            {isReadOnly && (
              <>
                {!isDelivered && (
                  <Button
                    className="w-fit"
                    isLoading={isDeleting || isPending}
                    onClick={openDeliveryMessage}
                  >
                    Marcar como entregado
                  </Button>
                )}
                <Button
                  variant="outline"
                  color="error"
                  className="w-fit"
                  isLoading={isDeleting || isPending}
                  onClick={showDeleteMessage}
                >
                  Eliminar
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default DeliveryForm;
