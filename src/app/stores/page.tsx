import Heading from "@/core/Heading";
import StoreCard from "./StoreCard";
import { getStores } from "@/queries/store";
import Button from "@/core/Button";
import Link from "next/link";

const page = async () => {
  const stores = await getStores();

  return (
    <div className="flex flex-col items-center px-4 pt-8 md:px-10">
      <Heading size="sm" className="mb-5">
        Tiendas
      </Heading>
      <div className="mb-6 flex w-full justify-end md:mb-10">
        <Link href="/stores/new">
          <Button>Agregar Tienda</Button>
        </Link>
      </div>
      <div className="mb-10 grid w-full gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {stores.map((s) => (
          <StoreCard
            key={s.id}
            url={s.url}
            name={s.name}
            photo={s.photo}
            productTypes={s.productTypes}
            productsCountry={s.productsCountry}
          />
        ))}
      </div>
    </div>
  );
};

export default page;
