"use client";

import ConfirmModal from "@/components/modules/ConfirmModal";
import Button from "@/core/Button";
import Icons from "@/core/Icons";
import {
  CREATE_CURRENCY,
  GET_CURRENCY,
  GET_STORE,
  UPDATE_ORDER,
} from "@/helpers/apiUrls";
import {
  FormState,
  orderStatusColor,
  orderStatusLabel,
} from "@/helpers/constants";
import { put } from "@/helpers/request";
import useRouter from "@/hooks/useRouter";
import useSelect from "@/hooks/useSelect";
import FormRow from "@/modules/FormRow";
import { OrderFull } from "@/types/prisma";
import { Currency, Order, OrderStatus } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import OrderFormProducts from "./OrderFormProducts";
import OrderNotes from "./OrderNotes";
import OrderPayments from "./OrderPayments";
import OrderReview from "./OrderReview";

export type Product = {
  productId?: string;
  deliveryId?: string;
  delivered?: boolean;
  productName: string;
  price?: number;
};

export type OrderFormType = {
  storeId: string;
  orderDate: Date;
  approximateDeliveryDate: {
    min?: Date;
    max?: Date;
  };
  products: Product[];
  currencyId: string;
  productsCost: number;
};

type OrderFormProps = {
  order?: OrderFull | null;
  isLoading?: boolean;
  onSubmit: (data: OrderFormType) => void;
};

const cancelOrder = (orderId: string) =>
  put<Order>(UPDATE_ORDER, { orderId, status: OrderStatus.Canceled });

const OrderForm: FC<OrderFormProps> = ({ isLoading, order, onSubmit }) => {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>(
    order != null ? FormState.view : FormState.create,
  );
  const [status, setStatus] = useState<OrderStatus | undefined>(order?.status);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const { options: stores } = useSelect(["stores"], GET_STORE);

  const isViewing = formState === FormState.view;
  const isCreating = formState === FormState.create;

  const { isLoading: isCanceling, mutate } = useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onSuccess: () => setStatus(OrderStatus.Canceled),
  });

  const { options: currencyOptions, addNewOption: addNewCurrency } =
    useSelect<Currency>(["currencies"], GET_CURRENCY, CREATE_CURRENCY);

  const isDeliveryAvailable =
    (order?.products?.filter((p) => p.deliveryId == null)?.length ?? 0) > 0;

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    setFocus,
    clearErrors,
    formState: { errors },
  } = useForm<OrderFormType>();

  useEffect(() => {
    if (order) {
      setValue("storeId", order.storeId);
      setValue("orderDate", order.orderDate);
      setValue("currencyId", order.currencyId);
      setValue("productsCost", order.productsCost);
      if (
        order.minApproximateDeliveryDate &&
        order.maxApproximateDeliveryDate
      ) {
        setValue("approximateDeliveryDate", {
          min: order.minApproximateDeliveryDate,
          max: order.maxApproximateDeliveryDate,
        });
      }
      order.products.forEach((p, i) => {
        setValue(`products.${i}.productId`, p.id);
        p.deliveryId && setValue(`products.${i}.deliveryId`, p.deliveryId);
        setValue(`products.${i}.delivered`, p.delivery?.delivered);
        setValue(`products.${i}.productName`, p.productName);
        p.price && setValue(`products.${i}.price`, p.price);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculatePrice = () => {
    const values = getValues();
    const productsCost = values.products.reduce(
      (acc, curr) => acc + Number(!Number.isNaN(curr.price) ? curr.price : 0),
      0,
    );

    if (productsCost >= 0) {
      setValue("productsCost", productsCost);
      clearErrors("productsCost");
    }
  };

  const registerDelivery = () => {
    if (order) {
      router.push(
        `/deliveries/new?storeId=${order.storeId}&orderId=${order.id}`,
      );
    }
  };

  const toggleCancelModal = () => setShowCancelModal((m) => !m);

  const showCancelOrderModal = () => {
    if (order) {
      const hasDelivery = order.products.find((p) => p.deliveryId != null);
      if (hasDelivery) {
        return alert(
          "No se puede cancelar una orden con entregas programadas.",
        );
      } else {
        toggleCancelModal();
      }
    }
  };

  const confirmCancelOrder = () => {
    if (order) {
      mutate(order.id);
      toggleCancelModal();
    }
  };

  const handleEdit = () => setFormState(FormState.edit);

  const submit: SubmitHandler<OrderFormType> = (data) => {
    if (formState === FormState.edit) {
      setFormState(FormState.view);
    }
    onSubmit(data);
  };

  return (
    <>
      <ConfirmModal
        message="¿Estás seguro que quieres cancelar este pedido? Este proceso no se puede revertir."
        open={showCancelModal}
        onCancel={toggleCancelModal}
        onConfirm={confirmCancelOrder}
      />
      <div className="flex flex-col gap-x-4">
        {order && (
          <OrderReview
            storeId={order.storeId}
            orderId={order.id}
            review={order.review}
          />
        )}
        <form className="flex w-full flex-col" onSubmit={handleSubmit(submit)}>
          {!isCreating && status != null && (
            <FormRow
              title="Estado"
              Icon={Icons.Tag}
              type="chip"
              label={orderStatusLabel[status]}
              color={orderStatusColor[status]}
            />
          )}
          <FormRow
            title="Tienda"
            Icon={Icons.Store}
            placeholder="Selecciona una tienda"
            searchPlaceholder="Busca una tienda"
            type="select"
            options={stores}
            control={control}
            formField="storeId"
            readOnly={!!order}
            allowSearch
            required
            error={!!errors.storeId}
            errorMessage="La tienda es obligatoria"
          />
          <FormRow
            title="Fecha de orden"
            Icon={Icons.Calendar}
            placeholder="Selecciona la fecha de orden"
            type="datepicker"
            control={control}
            formField="orderDate"
            readOnly={isViewing}
            maxDate={new Date()}
            required
            error={!!errors.orderDate}
            errorMessage="La fecha de orden es obligatoria"
          />
          {!(
            isViewing &&
            (order?.maxApproximateDeliveryDate == null ||
              order?.minApproximateDeliveryDate == null)
          ) && (
            <FormRow
              title="Fecha aprox. de entrega"
              Icon={Icons.CalendarDays}
              placeholder="Selecciona el rango de entrega"
              type="dateRangePicker"
              control={control}
              formField="approximateDeliveryDate"
              readOnly={isViewing}
              minDate={isCreating ? new Date() : undefined}
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
            readOnly={isViewing}
          />
          <FormRow
            title="Costo Total"
            Icon={Icons.Money}
            placeholder="1234"
            type="input"
            readOnly={isViewing}
            ButtonIcon={Icons.Calculator}
            onButtonClick={calculatePrice}
            error={!!errors.productsCost}
            errorMessage="El costo total es obligatorio"
            inputType="number"
            min={0}
            {...register("productsCost", {
              required: true,
              valueAsNumber: true,
            })}
          />
          <OrderFormProducts
            control={control}
            formField="products"
            register={register}
            setFocus={setFocus}
            errors={errors.products}
            readOnly={isViewing}
            products={order?.products}
          />
          {!isViewing && (
            <Button
              type="submit"
              className="mt-5 w-fit"
              isLoading={isLoading}
              StartIcon={Icons.Save}
            >
              Guardar
            </Button>
          )}
        </form>
        {order && isViewing && (
          <>
            <OrderPayments
              orderId={order.id}
              payments={order.orderPayments}
              productsCost={order.productsCost}
              currency={order.currency.name}
            />
            <OrderNotes orderId={order.id} notes={order.orderNotes} />
          </>
        )}
        {status !== OrderStatus.Canceled && (
          <div className="mt-8 flex flex-col gap-4 md:flex-row">
            {isViewing && isDeliveryAvailable && (
              <Button
                className="md:w-fit"
                onClick={registerDelivery}
                StartIcon={Icons.Courier}
                isLoading={isLoading}
              >
                Registrar Entrega
              </Button>
            )}
            {isViewing && (
              <>
                <Button
                  variant="outline"
                  className="md:w-fit"
                  onClick={handleEdit}
                  StartIcon={Icons.Edit}
                  isLoading={isLoading}
                >
                  Editar
                </Button>
                <Button
                  color="error"
                  variant="outline"
                  className="md:w-fit"
                  isLoading={isCanceling || isLoading}
                  onClick={showCancelOrderModal}
                  StartIcon={Icons.Cancel}
                >
                  Cancelar
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderForm;
