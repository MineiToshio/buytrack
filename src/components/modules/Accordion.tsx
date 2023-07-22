import { FC, useState } from "react";
import Typography from "../core/Typography";
import Icons from "../core/Icons";
import { cn } from "@/styles/utils";

type AccordionProps = {
  title: string;
  className?: string;
  children: React.ReactNode | Array<React.ReactNode>;
};

const Accordion: FC<AccordionProps> = ({ title, className, children }) => {
  const [collapse, setCollapse] = useState<boolean>(false);

  const toggleCollapse = () => setCollapse((c) => !c);

  return (
    <div className={cn("flex flex-col", className)}>
      <button
        type="button"
        className="flex items-center"
        onClick={toggleCollapse}
      >
        <Icons.ChevronRight
          className={cn("transition", { "rotate-90": !collapse })}
        />
        <Typography>{title}</Typography>
      </button>
      <div
        className={cn("ml-6 overflow-y-auto transition", {
          "h-0": collapse,
        })}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
