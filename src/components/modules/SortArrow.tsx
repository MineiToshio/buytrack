import { SortDirection } from "@tanstack/react-table";
import { FC } from "react";
import Icons from "../core/Icons";

type SortArrowProps = {
  sortDirection: false | SortDirection;
};

const SortArrow: FC<SortArrowProps> = ({ sortDirection }) => {
  if (sortDirection === "asc") return <Icons.ChevronUp size={20} />;
  if (sortDirection === "desc") return <Icons.ChevronDown size={20} />;
  return null;
};

export default SortArrow;
