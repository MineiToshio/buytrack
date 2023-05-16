import { FC } from "react";
import { cn } from "@/styles/utils";
import { logoFont } from "@/styles/fonts";

const Logo: FC = () => (
  <span className={cn("text-3xl text-white", logoFont.className)}>
    BuyTrack
  </span>
);

export default Logo;
