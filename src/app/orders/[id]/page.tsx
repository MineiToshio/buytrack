import Hydrate from "@/modules/Hydrate";
import Heading from "@/core/Heading";
import { getQueryClient } from "@/helpers/reactQuery";
import { dehydrate } from "@tanstack/react-query";
import { getStores } from "@/queries/store";
import ViewOrderForm from "./ViewOrderForm";
import { getCurrencies } from "@/queries/currency";
import { getOrderById } from "@/queries/order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/helpers/auth";
import { notFound } from "next/navigation";

type Params = {
  params: {
    id: string;
  };
};

const page = async ({ params }: Params) => {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(["stores"], getStores),
    queryClient.prefetchQuery(["currencies"], getCurrencies),
  ]);
  const dehydratedState = dehydrate(queryClient);

  const order = await getOrderById(params.id, session.user.id);

  return (
    <div className="flex w-full flex-col items-center px-4 pt-8 md:px-10">
      <Heading size="sm" className="mb-6 md:mb-10">
        Detalles del Pedido
      </Heading>
      <div className="w-form">
        <Hydrate state={dehydratedState}>
          <ViewOrderForm order={order} />
        </Hydrate>
      </div>
    </div>
  );
};

export default page;
