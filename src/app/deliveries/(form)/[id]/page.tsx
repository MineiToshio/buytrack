import Heading from "@/core/Heading";
import { authOptions } from "@/helpers/auth";
import { getQueryClient } from "@/helpers/reactQuery";
import Hydrate from "@/modules/Hydrate";
import { getCurrencies } from "@/queries/currency";
import { getDeliveryById } from "@/queries/delivery";
import { getOrdersWithoutDeliveredProducts } from "@/queries/order";
import { getStoreByAvailableOrders } from "@/queries/store";
import { dehydrate } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import ViewDeliveryForm from "./ViewDeliveryForm";

type Params = {
  params: {
    id: string;
  };
};

const page = async ({ params }: Params) => {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const delivery = await getDeliveryById(params.id, session.user.id);
  if (delivery == null) return notFound();

  const queryClient = getQueryClient();
  const res = await Promise.all([
    queryClient.prefetchQuery(["currencies"], getCurrencies),
    getStoreByAvailableOrders(session.user.id, delivery?.storeId),
    getOrdersWithoutDeliveredProducts(session.user.id, params.id),
  ]);
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="flex w-full flex-col items-center px-4 pt-8 md:px-10">
      <Heading size="sm" className="mb-6 md:mb-10">
        Detalles de la Entrega
      </Heading>
      <div className="w-full max-w-4xl">
        <Hydrate state={dehydratedState}>
          <ViewDeliveryForm
            stores={res[1]}
            orders={res[2]}
            delivery={delivery}
          />
        </Hydrate>
      </div>
    </div>
  );
};

export default page;
