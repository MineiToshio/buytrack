import Chip from "@/core/Chip";
import Icons from "@/core/Icons";
import Typography from "@/core/Typography";
import { ProductType, ProductsCountry } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface StoreCardProps {
  url: string;
  photo?: string | null;
  name: string;
  productTypes?: {
    productType: ProductType;
  }[];
  productsCountry?: {
    country: ProductsCountry;
  }[];
}

const StoreCard: FC<StoreCardProps> = ({
  url,
  photo,
  name,
  productTypes,
  productsCountry,
}) => {
  return (
    <Link href={`/stores/${url}`}>
      <div className="flex w-full flex-col rounded-md border border-solid shadow-sm hover:border-primary">
        <div className="relative h-52 w-full">
          {photo ? (
            <Image
              fill
              src={photo}
              alt={name}
              className="rounded-t-md object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-50">
              <Icons.Store size={100} className="text-emerald-200" />
            </div>
          )}
        </div>
        <div className="flex w-full flex-col p-2">
          <Typography
            className="block truncate text-left font-semibold"
            title={name}
          >
            {name}
          </Typography>
          {((productTypes && productTypes.length > 0) ||
            (productsCountry && productsCountry.length > 0)) && (
            <div className="mt-1 flex flex-wrap gap-1">
              {productTypes?.map(({ productType: p }) => (
                <Chip
                  key={p.id}
                  label={p.name}
                  size="xs"
                  color="secondary"
                  title="Tipo de producto"
                />
              ))}
              {productsCountry?.map(({ country: c }) => (
                <Chip
                  key={c.id}
                  label={c.name}
                  size="xs"
                  color="secondary-alt"
                  title="País de importación"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default StoreCard;
