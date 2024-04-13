import Icons from "@/components/core/Icons";
import Typography from "@/components/core/Typography";
import { cn } from "@/styles/utils";
import { LucideIcon } from "lucide-react";
import { FC } from "react";

type InfoCardProps = {
  title: string;
  Icon: LucideIcon;
  data: string;
  className?: string;
  iconColor?: string;
};

const InfoCard: FC<InfoCardProps> = ({
  title,
  Icon,
  data,
  iconColor,
  className,
}) => {
  return (
    <div
      className={cn(
        "w-full bg-slate-100 p-2 rounded-lg shadow-md flex gap-2",
        className,
      )}
    >
      <div className="flex w-12">
        <div
          className={cn(
            "rounded-full p-2 w-12 h-12 flex items-center justify-center",
            iconColor,
          )}
        >
          <Icon size={20} />
        </div>
      </div>
      <div className="flex w-full flex-col">
        <Typography color="muted" size="sm">
          {title}
        </Typography>
        <Typography className="font-bold text-3xl xl:text-5xl" size="unset">
          {data}
        </Typography>
      </div>
    </div>
  );
};

export default InfoCard;
