import Heading from "@/core/Heading";
import Button from "@/core/Button";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/helpers/auth";
import { notFound } from "next/navigation";
import { getDeliveries } from "@/queries/delivery";
import DeliveryTable from "./DeliveryTable";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const deliveries = await getDeliveries(session.user.id);

  return (
    <div className="flex flex-col items-center px-4 pt-8 md:px-10">
      <Heading size="sm" className="mb-5">
        Entregas
      </Heading>
      <div className="mb-5 flex w-full justify-end">
        <Link href="/deliveries/new">
          <Button>Nueva Entrega</Button>
        </Link>
      </div>
      <DeliveryTable deliveries={deliveries} />
    </div>
  );
};

export default page;
