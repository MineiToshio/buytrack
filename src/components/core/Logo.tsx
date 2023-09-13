import { FC } from "react";
import { cn } from "@/styles/utils";
import { logoFont } from "@/styles/fonts";
import { VariantProps, cva } from "class-variance-authority";

const logoVariants = cva(`text-3xl ${logoFont.className}`, {
  variants: {
    color: {
      primary: "text-primary",
      white: "text-white",
    },
  },
  defaultVariants: {
    color: "white",
  },
});

type LogoProps = VariantProps<typeof logoVariants> & {
  className?: string;
};

const Logo: FC<LogoProps> = ({ color, className }) => (
  <span
    className={cn(
      logoVariants({
        color,
        className,
      }),
    )}
  >
    BuyTrack
  </span>
);

export default Logo;
