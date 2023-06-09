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
    <div className="flex w-full flex-col items-center px-10 pt-8">
      <Heading size="sm" className="mb-5">
        Detalles del Pedido
      </Heading>
      <div className="w-full max-w-4xl">
        <Hydrate state={dehydratedState}>
          <ViewOrderForm order={order} />
        </Hydrate>
      </div>
    </div>
  );
};

export default page;
