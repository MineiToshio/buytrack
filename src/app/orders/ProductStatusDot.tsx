"use client";

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
  const StatusIcon = deliveryStatusData[statusAttribute].icon;

  const handleClick = () => {
    if (deliveryId) {
      router.push(`/deliveries/${deliveryId}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      title={deliveryStatusData[statusAttribute].label}
      className={cn({
        "cursor-default": deliveryId == null,
      })}
    >
      <StatusIcon size={18} className={cn("text-letters", className)} />
    </button>
  );
};

export default ProductStatusDot;
