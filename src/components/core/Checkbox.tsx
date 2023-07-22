import { FC, InputHTMLAttributes } from "react";
import Typography from "./Typography";
import { cn } from "@/styles/utils";

type CheckboxProps = {
  label: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

const Checkbox: FC<CheckboxProps> = ({ label, className, ...props }) => {
  return (
    <label className={cn("flex cursor-pointer items-center", className)}>
      <input type="checkbox" {...props} className="h-5 w-5 accent-primary" />
      <Typography className="ml-2">{label}</Typography>
    </label>
  );
};

export default Checkbox;
