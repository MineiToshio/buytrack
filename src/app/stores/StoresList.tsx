"use client";

import Button from "@/components/core/Button";
import { StoreFull } from "@/types/prisma";
import { FC } from "react";
import StoreCard from "./StoreCard";
import Icons from "@/components/core/Icons";
import Link from "next/link";

type StoresListProps = {
  stores: StoreFull[];
};

const StoresList: FC<StoresListProps> = ({ stores }) => {
  return (
    <>
      <div className="mb-6 flex w-full justify-end md:mb-10">
        <Link href="/stores/new">
          <Button StartIcon={Icons.Add}>Agregar Tienda</Button>
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
    </>
  );
};

export default StoresList;
