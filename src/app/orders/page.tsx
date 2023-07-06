import Button from "@/core/Button";
import Heading from "@/core/Heading";
import { authOptions } from "@/helpers/auth";
import { getOrdersByUser } from "@/queries/order";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import OrderTable from "./OrderTable";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const orders = await getOrdersByUser(session.user.id);

  return (
    <div className="flex flex-col items-center px-4 pt-8 md:px-10">
      <Heading size="sm" className="mb-5">
        Pedidos
      </Heading>
      <div className="mb-5 flex w-full justify-end">
        <Link href="/orders/new">
          <Button>Agregar Pedido</Button>
        </Link>
      </div>
      <OrderTable orders={orders} />
    </div>
  );
};

export default page;
