import Heading from "@/core/Heading";
import NewStoreForm from "@/app/stores/new/NewStoreForm";
import { getQueryClient } from "@/helpers/reactQuery";
import { getCountries } from "@/queries/country";
import { dehydrate } from "@tanstack/react-query";
import Hydrate from "@/modules/Hydrate";

const page = async ({}) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["country"], getCountries);
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="flex w-full flex-col items-center px-10 pt-8">
      <Heading size="sm" className="mb-5">
        Nueva Tienda
      </Heading>
      <div className="w-full max-w-4xl">
        <Hydrate state={dehydratedState}>
          <NewStoreForm />
        </Hydrate>
      </div>
    </div>
  );
};

export default page;
