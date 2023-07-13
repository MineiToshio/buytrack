"use client";

import DatePicker from "@/components/core/DatePicker";
import ConfirmModal from "@/components/modules/ConfirmModal";
import Button from "@/core/Button";
import Icons from "@/core/Icons";
import Input from "@/core/Input";
import Typography from "@/core/Typography";
import { CREATE_ORDER_PAYMENT, DELETE_ORDER_PAYMENT } from "@/helpers/apiUrls";
import { post } from "@/helpers/request";
import { formatDate } from "@/helpers/utils";
import useDelete from "@/hooks/useDeleteModal";
import Modal from "@/modules/Modal";
import { cn } from "@/styles/utils";
import { OrderPayment } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { FC, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type Form = {
  paymentDate: Date;
  amount: number;
};

type OrderPaymentsProps = {
  orderId: string;
  productsCost: number;
  payments: OrderPayment[];
  currency: string;
};

const createPaymentReq = async (paymentDate: Form, orderId: string) =>
  post<OrderPayment>(CREATE_ORDER_PAYMENT, { ...paymentDate, orderId });

const OrderPayments: FC<OrderPaymentsProps> = ({
  payments,
  orderId,
  productsCost,
  currency,
}) => {
  const [currentPayments, setCurrentPayments] =
    useState<OrderPayment[]>(payments);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);

  const orderedPayments = currentPayments.sort(
    (a, b) =>
      new Date(b.paymentDate).getDate() - new Date(a.paymentDate).getDate(),
  );

  const {
    showDeleteModal,
    deleteId,
    isLoading: isLoadingDeletePayment,
    deleteData: deletePayment,
    openDeleteModal,
    closeDeleteModal,
  } = useDelete(DELETE_ORDER_PAYMENT, (success, currentDeleteId) => {
    if (success) {
      setCurrentPayments((currPayments) =>
        currPayments.filter((p) => p.id !== currentDeleteId),
      );
    }
  });

  const remainingAmount = useMemo(() => {
    const paidAmount = currentPayments.reduce(
      (acc, curr) => acc + curr.amount,
      0,
    );
    return productsCost - paidAmount;
  }, [currentPayments, productsCost]);

  const {
    register,
    control,
    handleSubmit,
    resetField,
    setError,
    formState: { errors },
  } = useForm<Form>();

  const { isLoading: isLoadingNewPayment, mutate: createPaymentMutate } =
    useMutation({
      mutationFn: (data: Form) => createPaymentReq(data, orderId),
      onSuccess: (payment) => {
        if (payment) {
          setCurrentPayments((p) => [payment, ...p]);
        }
      },
    });

  const toggleOpenModal = () => setIsPaymentModalOpen((o) => !o);

  const openModal = () => {
    toggleOpenModal();
    resetField("amount");
    resetField("paymentDate");
  };

  const addPayment = (data: Form) => {
    if (remainingAmount < data.amount) {
      setError("amount", { type: "custom" });
    } else {
      toggleOpenModal();
      createPaymentMutate(data);
    }
  };

  return (
    <>
      <ConfirmModal
        message="¿Deseas eliminar este pago?"
        confirmText="Eliminar"
        open={showDeleteModal}
        onCancel={closeDeleteModal}
        onConfirm={deletePayment}
      />
      <Modal open={isPaymentModalOpen} onClose={toggleOpenModal}>
        <form
          className="flex flex-col gap-y-4 p-4"
          onSubmit={handleSubmit(addPayment)}
        >
          <Typography>Agrega un nuevo pago</Typography>
          <Controller
            name="paymentDate"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker
                variant="standard"
                placeholder="Fecha de pago"
                onChange={field.onChange}
                value={field.value}
                maxDate={new Date()}
                className={cn({
                  "border-error": !!errors?.paymentDate,
                })}
              />
            )}
          />
          <div className="flex flex-col">
            <Input
              variant="standard"
              placeholder="Monto"
              type="number"
              min={0}
              {...register("amount", {
                required: true,
                valueAsNumber: true,
              })}
              className={cn({
                "border-error": !!errors?.amount,
              })}
            />
            <Typography color="muted" size="2xs" className="mt-1">
              *El monto máximo es de {remainingAmount}.
            </Typography>
          </div>
          <Button type="submit">Agregar</Button>
        </form>
      </Modal>
      <div className="flex w-full flex-col">
        <div className="flex w-full items-center justify-between">
          <Typography color="muted">Pagos Realizados</Typography>
          {remainingAmount > 0 && (
            <Button
              title="Agregar pago"
              variant="icon"
              onClick={openModal}
              isLoading={isLoadingNewPayment}
            >
              <Icons.Add />
            </Button>
          )}
        </div>
        {orderedPayments.length > 0 ? (
          <table className="table-auto">
            <thead>
              <tr>
                <th className="text-left">
                  <Typography color="muted">#</Typography>
                </th>
                <th>
                  <Typography color="muted">Fecha de Pago</Typography>
                </th>
                <th>
                  <Typography color="muted">Monto</Typography>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {currentPayments.map((p, i) => (
                <tr key={p.id}>
                  <td className="pr-2 text-left">
                    <Typography>{i + 1}</Typography>
                  </td>
                  <td className="text-center">
                    <Typography>{formatDate(p.paymentDate)}</Typography>
                  </td>
                  <td>
                    <Typography>{`${currency} ${p.amount}`}</Typography>
                  </td>
                  <td>
                    <Button
                      variant="icon"
                      color="muted"
                      isLoading={isLoadingDeletePayment && p.id === deleteId}
                      onClick={() => openDeleteModal(p.id)}
                    >
                      <Icons.Delete size={15} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Typography>No hay pagos registrados.</Typography>
        )}
      </div>
    </>
  );
};

export default OrderPayments;
