import { FC } from "react";
import Typography from "@/core/Typography";
import Heading from "@/core/Heading";
import Image from "next/image";

const Hero: FC = () => {
  return (
    <div className="flex h-full w-full flex-col-reverse items-center justify-end gap-4 bg-slate-100 px-4 py-8 md:h-96 md:flex-row md:justify-center md:gap-8 md:px-10">
      <div className="flex w-full flex-col md:h-full md:w-1/2 md:justify-center">
        <Heading className="mb-7 text-center md:text-left">
          Administra tus compras en un solo lugar
        </Heading>
        <Typography className="text-center md:text-left">
          Con BuyTrack el caos de comprar se acaba. Has crecer tus colecciones
          sin perder de vista ninguna de tus compras.
        </Typography>
      </div>
      <div className="h-48 w-full md:h-full md:w-1/2 md:py-10">
        <div className="relative h-full w-full overflow-hidden">
          <Image
            className="w-full object-contain"
            alt="collection"
            src="/images/collection.jpg"
            quality={100}
            fill
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
