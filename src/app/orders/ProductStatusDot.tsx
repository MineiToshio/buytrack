"use client";

import { deliveryStatusData } from "@/helpers/constants";
import useRouter from "@/hooks/useRouter";
import { cn } from "@/styles/utils";
import { cva } from "class-variance-authority";
import { FC } from "react";
import { getStatusAttribute } from "./utils";

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
  deliveryId?: string | null;
};

const ProductStatusDot: FC<ProductStatusDotProps> = ({
  isDelivered,
  className,
  deliveryId,
}) => {
  const router = useRouter();
  const statusAttribute = getStatusAttribute(isDelivered);

  const handleClick = () => {
    if (deliveryId) {
      router.push(`/deliveries/${deliveryId}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      title={deliveryStatusData[statusAttribute].label}
      className={cn(
        productStatusDotVariants({
          color: deliveryStatusData[statusAttribute].color,
          className,
        }),
        {
          "cursor-default": deliveryId == null,
        },
      )}
    />
  );
};

export default ProductStatusDot;
