import Typography from "@/components/core/Typography";
import { FC } from "react";

type CollapseTableInfoProps = {
  title: string;
  info: string;
};

const CollapseTableInfo: FC<CollapseTableInfoProps> = ({ title, info }) => (
  <div className="flex gap-2">
    <Typography className="font-semibold">{title}</Typography>
    <Typography>{info}</Typography>
  </div>
);

export default CollapseTableInfo;
