import { cn } from "@/styles/utils";
import { VariantProps, cva } from "class-variance-authority";
import { HTMLAttributes, forwardRef } from "react";

const typographyVariants = cva("text-slate-700", {
  variants: {
    size: {
      default: "text-base sm:text-lg",
      sm: "text-sm, sm:text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type TypographyProps = HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof typographyVariants> & {
    as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  };

const Typography = forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, size, children, as = "p", ...props }, ref) => {
    const Element = as;
    return (
      <Element
        ref={ref}
        {...props}
        className={cn(typographyVariants({ size, className }))}
      >
        {children}
      </Element>
    );
  }
);

Typography.displayName = "Paragraph";

export default Typography;
