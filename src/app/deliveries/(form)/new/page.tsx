import Heading from "@/core/Heading";
import { authOptions } from "@/helpers/auth";
import { getQueryClient } from "@/helpers/reactQuery";
import Hydrate from "@/modules/Hydrate";
import { getCurrencies } from "@/queries/currency";
import { getOrdersWithoutDeliveredProducts } from "@/queries/order";
import { getStoreByAvailableOrders } from "@/queries/store";
import { dehydrate } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import NewDeliveryForm from "./NewDeliveryForm";
import Typography from "@/components/core/Typography";
import Link from "next/link";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const queryClient = getQueryClient();
  const res = await Promise.all([
    queryClient.prefetchQuery(["currencies"], getCurrencies),
    getStoreByAvailableOrders(session.user.id),
    getOrdersWithoutDeliveredProducts(session.user.id),
  ]);
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="flex w-full flex-col items-center px-4 pt-8 md:px-10">
      <Heading size="sm" className="mb-6 md:mb-10">
        Nueva Entrega
      </Heading>
      <div className="w-full max-w-4xl">
        {res[1].length > 0 ? (
          <Hydrate state={dehydratedState}>
            <NewDeliveryForm stores={res[1]} orders={res[2]} />
          </Hydrate>
        ) : (
          <div className="mt-5 flex w-full justify-center">
            <Typography>
              Es necesario tener órdenes pendientes para registrar una entrega.
              Registra tu orden{" "}
              <Link
                href="/orders/new"
                className="text-primary hover:text-green-600"
              >
                aquí
              </Link>
              .
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
