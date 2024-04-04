import Heading from "@/core/Heading";
import { authOptions } from "@/helpers/auth";
import { getQueryClient } from "@/helpers/reactQuery";
import Hydrate from "@/modules/Hydrate";
import { getCurrencies } from "@/queries/currency";
import { getStores } from "@/queries/store";
import { dehydrate } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import NewOrderForm from "./NewOrderForm";
import { getUserById } from "@/queries/user";
import Typography from "@/components/core/Typography";
import Link from "next/link";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(["stores"], getStores),
    queryClient.prefetchQuery(["currencies"], getCurrencies),
  ]);
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="flex w-full flex-col items-center px-4 pt-8 md:px-10">
      <Heading size="sm" className="mb-6 md:mb-10">
        Nuevo Pedido
      </Heading>
      <div className="w-form">
        {session.user.currency ? (
          <Hydrate state={dehydratedState}>
            <NewOrderForm user={session.user!} />
          </Hydrate>
        ) : (
          <div className="w-full flex justify-center">
            <Typography>
              Para registrar un pedido, primero{" "}
              <Link href="/profile" className="link">
                elige tu moneda local
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
