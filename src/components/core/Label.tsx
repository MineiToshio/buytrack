import { FC, LabelHTMLAttributes } from "react";
import Typography from "./Typography";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  text: string;
};

const Label: FC<LabelProps> = ({ text, children, ...props }) => {
  return (
    <label {...props}>
      <Typography size="xs" className="ml-2" color="muted">
        {text}
      </Typography>
      {children}
    </label>
  );
};

export default Label;
