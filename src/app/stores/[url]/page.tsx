import { getQueryClient } from "@/helpers/reactQuery";
import Hydrate from "@/modules/Hydrate";
import { getCountries } from "@/queries/country";
import { getProductTypes } from "@/queries/productType";
import { getProductsCountries } from "@/queries/productsCountry";
import { getStoreByUrl } from "@/queries/store";
import { dehydrate } from "@tanstack/react-query";
import ViewStoreForm from "./ViewStoreForm";

type Params = {
  params: {
    url: string;
  };
};

const page = async ({ params }: Params) => {
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(["country"], getCountries),
    queryClient.prefetchQuery(["products-country"], getProductsCountries),
    queryClient.prefetchQuery(["product-type"], getProductTypes),
  ]);
  const dehydratedState = dehydrate(queryClient);

  const store = await getStoreByUrl(params.url);

  return (
    <div className="flex w-full flex-col items-center px-4 pt-8 md:px-10">
      <div className="w-form">
        <Hydrate state={dehydratedState}>
          <ViewStoreForm store={store} />
        </Hydrate>
      </div>
    </div>
  );
};

export default page;
