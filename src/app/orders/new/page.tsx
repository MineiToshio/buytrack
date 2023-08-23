import Hydrate from "@/modules/Hydrate";
import Heading from "@/core/Heading";
import { getQueryClient } from "@/helpers/reactQuery";
import { dehydrate } from "@tanstack/react-query";
import { getStores } from "@/queries/store";
import NewOrderForm from "./NewOrderForm";
import { getCurrencies } from "@/queries/currency";

const page = async () => {
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(["stores"], getStores),
    queryClient.prefetchQuery(["currencies"], getCurrencies),
  ]);
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="flex w-full flex-col items-center px-10 pt-8">
      <Heading size="sm" className="mb-6 md:mb-10">
        Nuevo Pedido
      </Heading>
      <div className="w-full max-w-4xl">
        <Hydrate state={dehydratedState}>
          <NewOrderForm />
        </Hydrate>
      </div>
    </div>
  );
};

export default page;
