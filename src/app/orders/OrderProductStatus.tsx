"use client";

import Chip from "@/components/core/Chip";
import { deliveryStatusData } from "@/helpers/constants";
import useRouter from "@/hooks/useRouter";
import { cn } from "@/styles/utils";
import { FC } from "react";
import { getStatusAttribute } from "./utils";

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
      className={cn(className, {
        "cursor-default": deliveryId == null,
      })}
    >
      <Chip
        label={deliveryStatusData[statusAttribute].label}
        color={deliveryStatusData[statusAttribute].color}
        size="xs"
        className="w-[85px] justify-center"
      />
    </button>
  );
};

export default ProductStatusDot;
