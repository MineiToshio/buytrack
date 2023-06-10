import { FC } from "react";
import Typography from "@/core/Typography";

const Footer: FC = () => {
  return (
    <div className="mt-10 flex h-20 flex-col items-center justify-center bg-gray-900">
      <Typography size="xs" className="mb-1 text-white">
        Creado por{" "}
        <a
          href="https://toshiominei.com"
          target="_blank"
          className="hover:underline"
        >
          Sergio Toshio Minei
        </a>
      </Typography>
      <Typography size="xs" className="text-white">
        ©{new Date().getFullYear()} BuyTrack
      </Typography>
    </div>
  );
};

export default Footer;
