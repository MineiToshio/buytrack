import Heading from "@/core/Heading";
import { authOptions } from "@/helpers/auth";
import { getQueryClient } from "@/helpers/reactQuery";
import { filterDeliveries, getDeliveries } from "@/queries/delivery";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import DeliveriesList from "./DeliveriesList";
import { isDeliveryStatus } from "@/types/prisma";
import { deliveryStatus } from "@/helpers/constants";

type SearchParams = {
  approximateDeliveryDate?: string;
  storeId?: string;
  status?: string;
};

type Props = {
  searchParams: SearchParams;
};

const getFilterData = (searchParams: SearchParams) => {
  const approximateDeliveryDate =
    searchParams.approximateDeliveryDate?.split(",");
  const status = searchParams.status?.split(",");

  const approximateDeliveryDateFilter = approximateDeliveryDate
    ? {
        min: new Date(approximateDeliveryDate[0]),
        max: new Date(approximateDeliveryDate[1]),
      }
    : undefined;

  const deliveredArray = status?.filter((s) => isDeliveryStatus(s));

  const deliveredFilter =
    deliveredArray?.length !== 1
      ? undefined
      : deliveredArray.includes(deliveryStatus.delivered)
      ? false
      : true;

  return {
    approximateDeliveryDate: approximateDeliveryDateFilter,
    status: deliveredFilter,
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
      "deliveries",
      searchParams.approximateDeliveryDate,
      searchParams.status,
      searchParams.storeId,
    ],
    () =>
      filterDeliveries(
        session.user.id,
        filterData.approximateDeliveryDate,
        filterData.storeId,
        filterData.status,
      ),
  );
  const dehydratedState = dehydrate(queryClient);

  const deliveries = await getDeliveries(session.user.id);

  return (
    <div className="flex flex-col items-center px-4 pt-8 md:px-10">
      <Heading size="sm" className="mb-5">
        Entregas
      </Heading>
      <Hydrate state={dehydratedState}>
        <DeliveriesList deliveries={deliveries} />
      </Hydrate>
    </div>
  );
};

export default page;
