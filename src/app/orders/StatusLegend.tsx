import Typography from "@/components/core/Typography";
import { deliveryStatusData } from "@/helpers/constants";
import { cn } from "@/styles/utils";
import { FC } from "react";
import ProductStatusDot from "./ProductStatusDot";
import { getStatusAttribute } from "./utils";

type StatusProps = {
  isDelivered?: boolean;
};

const Status: FC<StatusProps> = ({ isDelivered }) => {
  const statusAttribute = getStatusAttribute(isDelivered);
  return (
    <div className="flex items-center gap-1">
      <ProductStatusDot isDelivered={isDelivered} />
      <Typography color="muted">
        {deliveryStatusData[statusAttribute].label}
      </Typography>
    </div>
  );
};

type StatusLegendProps = {
  className?: string;
};

const StatusLegend: FC<StatusLegendProps> = ({ className }) => (
  <div className={cn("flex gap-4", className)}>
    <Status />
    <Status isDelivered={false} />
    <Status isDelivered />
  </div>
);

export default StatusLegend;
