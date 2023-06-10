import Heading from "@/core/Heading";
import StoreCard from "./StoreCard";
import { getStores } from "@/queries/store";

const page = async () => {
  const stores = await getStores();

  return (
    <div className="flex flex-col items-center px-4 pt-8 md:px-10">
      <Heading size="sm" className="mb-5">
        Tiendas
      </Heading>
      <div className="mb-10 grid w-full gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {stores.map((s) => (
          <StoreCard
            key={s.id}
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
