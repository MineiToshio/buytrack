import NewStoreForm from "@/app/stores/new/NewStoreForm";
import Heading from "@/core/Heading";
import { getQueryClient } from "@/helpers/reactQuery";
import Hydrate from "@/modules/Hydrate";
import { getCountries } from "@/queries/country";
import { getProductTypes } from "@/queries/productType";
import { getProductsCountries } from "@/queries/productsCountry";
import { dehydrate } from "@tanstack/react-query";

const page = async ({}) => {
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(["country"], getCountries),
    queryClient.prefetchQuery(["products-country"], getProductsCountries),
    queryClient.prefetchQuery(["product-type"], getProductTypes),
  ]);
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="flex w-full flex-col items-center px-4 pt-8 md:px-10">
      <Heading size="sm" className="mb-6 md:mb-10">
        Nueva Tienda
      </Heading>
      <div className="w-form">
        <Hydrate state={dehydratedState}>
          <NewStoreForm />
        </Hydrate>
      </div>
    </div>
  );
};

export default page;
