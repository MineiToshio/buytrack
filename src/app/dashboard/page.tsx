import Heading from "@/core/Heading";
import Icons from "@/core/Icons";
import { authOptions } from "@/helpers/auth";
import { deliveryStatus } from "@/helpers/constants";
import {
  getDeliveriesGroupByStatus,
  getOrdersByMonth,
  getOrdersGroupByStatus,
  getOrdersOfTheMonth,
} from "@/queries/dashboard";
import { OrderStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import InfoCard from "./InfoCard";
import OrdersByStateTable from "./OrdersByStateTable";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const [ordersByStatus, deliveriesByStatus, ordersOfTheMonth, ordersByMonth] =
    await Promise.all([
      getOrdersGroupByStatus(session.user),
      getDeliveriesGroupByStatus(session.user),
      getOrdersOfTheMonth(session.user),
      getOrdersByMonth(session.user),
    ]);

  const pendingOrders = Object.entries(ordersByStatus).reduce(
    (acc, [key, value]) => {
      if (key !== OrderStatus.Canceled && key !== OrderStatus.Delivered) {
        return acc + value.count;
      }
      return acc;
    },
    0,
  );

  const pendingDeliveries =
    Object.entries(deliveriesByStatus).length > 0
      ? // @ts-ignore
        deliveriesByStatus[deliveryStatus.inRoute]
      : 0;

  const totalPaymentOfTheMonth = ordersOfTheMonth.reduce((acc, curr) => {
    if (
      curr.status !== OrderStatus.Canceled &&
      curr.status !== OrderStatus.Delivered
    ) {
      return acc + curr.remainingPayment;
    }
    return acc;
  }, 0);

  const pendingPayment = Object.entries(ordersByStatus).reduce(
    (acc, [key, value]) => {
      if (key !== OrderStatus.Canceled && key !== OrderStatus.Delivered) {
        return acc + value.productsCost;
      }
      return acc;
    },
    0,
  );

  return (
    <div className="p-page flex flex-col items-center">
      <Heading size="sm" className="mb-5">
        Dashboard
      </Heading>
      <div className="flex flex-col w-full">
        <div className="grid gap-4 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 w-full mb-8 lg:mb-12">
          <InfoCard
            title="Órdenes pendientes"
            Icon={Icons.File}
            iconColor="bg-secondary-alt text-white"
            data={pendingOrders.toString()}
          />
          <InfoCard
            title="Delivery pendientes"
            Icon={Icons.Courier}
            iconColor="bg-muted text-white"
            data={pendingDeliveries.toString()}
          />
          <InfoCard
            title="Pago total del mes"
            Icon={Icons.Money}
            iconColor="bg-primary text-white"
            data={`${session.user.currency
              ?.symbol} ${totalPaymentOfTheMonth.toString()}`}
          />
          <InfoCard
            title="Deuda pendiente"
            Icon={Icons.Bill}
            iconColor="bg-error text-white"
            data={`${session.user.currency
              ?.symbol} ${pendingPayment.toString()}`}
          />
        </div>
        <div className="flex w-full gap-4">
          <div className="flex flex-col w-full">
            <OrdersByStateTable data={ordersByStatus} />
          </div>
          <div className="flex flex-col w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default page;
