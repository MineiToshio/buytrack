import Heading from "@/core/Heading";
import { authOptions } from "@/helpers/auth";
import { getQueryClient } from "@/helpers/reactQuery";
import { filterOrdersByUser, getOrdersByUser } from "@/queries/order";
import { isOrderStatus } from "@/types/prisma";
import { OrderStatus } from "@prisma/client";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import OrdersList from "./OrdersList";

type SearchParams = {
  orderDate?: string;
  storeId?: string;
  status?: string;
};

type Props = {
  searchParams: SearchParams;
};

const getFilterData = (searchParams: SearchParams) => {
  const orderDate = searchParams.orderDate?.split(",");
  const status = searchParams.status?.split(",");

  const orderDateFilter = orderDate
    ? {
        min: new Date(orderDate[0]),
        max: new Date(orderDate[1]),
      }
    : undefined;

  const statusFilter = status?.reduce((acc: OrderStatus[], curr) => {
    if (isOrderStatus(curr)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  return {
    orderDate: orderDateFilter,
    status: statusFilter,
    storeId: searchParams.storeId,
  };
};

const page = async ({ searchParams }: Props) => {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const filterData = getFilterData(searchParams);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    [
      "orders",
      searchParams.orderDate,
      searchParams.status,
      searchParams.storeId,
    ],
    () =>
      filterOrdersByUser(
        session.user.id,
        filterData.orderDate,
        filterData.storeId,
        filterData.status,
      ),
  );
  const dehydratedState = dehydrate(queryClient);

  const orders = await getOrdersByUser(session.user.id);

  return (
    <div className="flex flex-col items-center px-4 pt-8 md:px-10">
      <Heading size="sm" className="mb-6 md:mb-10">
        Pedidos
      </Heading>
      <Hydrate state={dehydratedState}>
        <OrdersList orders={orders} />
      </Hydrate>
    </div>
  );
};

export default page;
