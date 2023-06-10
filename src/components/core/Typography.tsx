import { cn } from "@/styles/utils";
import { VariantProps, cva } from "class-variance-authority";
import { HTMLAttributes, forwardRef } from "react";

const typographyVariants = cva("", {
  variants: {
    size: {
      xs: "text-xs, sm:text-sm",
      sm: "text-sm, sm:text-base",
      md: "text-base sm:text-lg",
      lg: "text-lg, sm:text-xl",
    },
    color: {
      default: "text-slate-700",
      muted: "text-muted",
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
});

type TypographyProps = HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof typographyVariants> & {
    as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  };

const Typography = forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, size, color, children, as = "p", ...props }, ref) => {
    const Element = as;
    return (
      <Element
        ref={ref}
        {...props}
        className={cn(typographyVariants({ size, color, className }))}
      >
        {children}
      </Element>
    );
  }
);

Typography.displayName = "Paragraph";

export default Typography;
