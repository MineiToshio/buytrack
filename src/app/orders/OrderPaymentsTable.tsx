import Button from "@/core/Button";
import Icons from "@/core/Icons";
import Typography from "@/core/Typography";
import { DELETE_ORDER_PAYMENT } from "@/helpers/apiUrls";
import { formatDate } from "@/helpers/utils";
import useDeleteModal from "@/hooks/useDeleteModal";
import ConfirmModal from "@/modules/ConfirmModal";
import { cn } from "@/styles/utils";
import { OrderPayment } from "@prisma/client";
import { Dispatch, FC, SetStateAction } from "react";

type OrderPaymentTableProps = {
  payments: OrderPayment[];
  currency: string;
  productsCost: number;
  className?: string;
  onPaymentsChange?: Dispatch<SetStateAction<OrderPayment[]>>;
};

const OrderPaymentTable: FC<OrderPaymentTableProps> = ({
  payments,
  currency,
  productsCost,
  className,
  onPaymentsChange,
}) => {
  const orderedPayments = payments.sort(
    (a, b) =>
      new Date(b.paymentDate).getDate() - new Date(a.paymentDate).getDate(),
  );

  const paidAmount = orderedPayments.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  );

  const remainingAmount = productsCost - paidAmount;

  const {
    showDeleteModal,
    deleteId,
    isLoading: isLoadingDeletePayment,
    deleteData: deletePayment,
    openDeleteModal,
    closeDeleteModal,
  } = useDeleteModal(DELETE_ORDER_PAYMENT, (success, currentDeleteId) => {
    if (success && onPaymentsChange) {
      onPaymentsChange((currPayments) =>
        currPayments.filter((p) => p.id !== currentDeleteId),
      );
    }
  });

  return (
    <>
      <ConfirmModal
        message="¿Deseas eliminar este pago?"
        confirmText="Eliminar"
        open={showDeleteModal}
        onCancel={closeDeleteModal}
        onConfirm={deletePayment}
      />
      {orderedPayments.length > 0 ? (
        <table className={cn("table-auto", className)}>
          <tbody>
            {orderedPayments.map((p) => (
              <tr key={p.id}>
                <td className="py-0.5 pr-5 text-center">
                  <Typography className="text-right">
                    {formatDate(p.paymentDate)}
                  </Typography>
                </td>
                <td className="py-0.5">
                  <Typography>{`${currency} ${p.amount}`}</Typography>
                </td>
                <td className="py-0.5 text-end align-bottom">
                  {onPaymentsChange && (
                    <Button
                      variant="icon"
                      color="muted"
                      isLoading={isLoadingDeletePayment && p.id === deleteId}
                      onClick={() => openDeleteModal(p.id)}
                    >
                      <Icons.Delete size={18} />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t">
              <td className="py-0.5 pr-5 text-right">
                <Typography>Pago Total</Typography>
              </td>
              <td colSpan={2} className="text-left">
                <Typography>{`${currency} ${paidAmount}`}</Typography>
              </td>
            </tr>
            <tr>
              <td className="py-0.5 pr-5 text-right">
                <Typography>Monto Restante</Typography>
              </td>
              <td colSpan={2} className="py-0.5 text-left">
                <Typography>{`${currency} ${remainingAmount}`}</Typography>
              </td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <Typography>No hay pagos registrados.</Typography>
      )}
    </>
  );
};

export default OrderPaymentTable;
