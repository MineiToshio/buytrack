import { deliveryStatusData } from "@/helpers/constants";
import { cn } from "@/styles/utils";
import { cva } from "class-variance-authority";
import { FC } from "react";

export const getStatusAttribute = (isDelivered?: boolean) => {
  if (isDelivered == null) return 0;
  else if (isDelivered) return 1;
  else return 2;
};

const productStatusDotVariants = cva("rounded-full w-3 h-3 drop-shadow-md", {
  variants: {
    color: {
      error: "bg-error",
      primary: "bg-primary",
      secondary: "bg-secondary",
      muted: "bg-muted",
    },
  },
  defaultVariants: {
    color: "muted",
  },
});

type ProductStatusDotProps = {
  isDelivered?: boolean;
  className?: string;
};

const ProductStatusDot: FC<ProductStatusDotProps> = ({
  isDelivered,
  className,
}) => {
  const statusAttribute = getStatusAttribute(isDelivered);
  return (
    <div
      title={deliveryStatusData[statusAttribute].label}
      className={cn(
        productStatusDotVariants({
          color: deliveryStatusData[statusAttribute].color,
          className,
        }),
      )}
    />
  );
};

export default ProductStatusDot;
