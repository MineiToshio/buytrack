import Heading from "@/core/Heading";
import { getStores } from "@/queries/store";
import StoresList from "./StoresList";

const page = async () => {
  const stores = await getStores();

  return (
    <div className="flex flex-col items-center px-4 pt-8 md:px-10">
      <Heading size="sm" className="mb-5">
        Tiendas
      </Heading>
      <StoresList stores={stores} />
    </div>
  );
};

export default page;
