import Heading from "@/core/Heading";
import Icons from "@/core/Icons";
import { authOptions } from "@/helpers/auth";
import {
  getDeliveriesGroupByStatus,
  getOrdersFromPast12Months,
  getOrdersForThisMonth,
  getOrdersGroupByStatus,
  getPendingDeliveries,
  getPendingOrdersGroupByStore,
} from "@/queries/dashboard";
import { OrderStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import DeliveriesByStatusTable from "./DeliveriesByStatusTable";
import InfoCard from "./InfoCard";
import OrdersByStatusTable from "./OrdersByStatusTable";
import PendingDeliveriesTable from "./PendingDeliveriesTable";
import PendingOrdersByStoreTable from "./PendingOrdersByStoreTable";
import PendingOrdersThisMonthTable from "./PendingOrdersThisMonthTable";
import ProductOrderVsDeliveryChart from "./ProductOrderVsDeliveryChart";
import OrderCostVsPaidAmountChart from "./OrderCostVsPaidAmountChart";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const [
    ordersByStatus,
    deliveriesByStatus,
    ordersOfTheMonth,
    ordersByMonth,
    pendingOrdersByStore,
    pendingDeliveries,
  ] = await Promise.all([
    getOrdersGroupByStatus(session.user),
    getDeliveriesGroupByStatus(session.user),
    getOrdersForThisMonth(session.user),
    getOrdersFromPast12Months(session.user),
    getPendingOrdersGroupByStore(session.user),
    getPendingDeliveries(session.user),
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
        return acc + value.remainingPayment;
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
      <div className="flex flex-col w-full gap-10">
        <div className="grid gap-5 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 w-full">
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
            data={pendingDeliveries.length.toString()}
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
        <div className="flex w-full gap-5 flex-col md:flex-row">
          <ProductOrderVsDeliveryChart data={ordersByMonth} />
          <OrderCostVsPaidAmountChart
            data={ordersByMonth}
            currency={session.user.currency?.symbol}
          />
        </div>
        <div className="flex w-full gap-5 flex-col md:flex-row">
          <div className="flex flex-col w-full gap-10">
            <OrdersByStatusTable data={ordersByStatus} />
            <PendingOrdersThisMonthTable data={ordersOfTheMonth} />
          </div>
          <div className="flex flex-col w-full gap-10">
            <PendingOrdersByStoreTable data={pendingOrdersByStore} />
            <DeliveriesByStatusTable data={deliveriesByStatus} />
            <PendingDeliveriesTable data={pendingDeliveries} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
