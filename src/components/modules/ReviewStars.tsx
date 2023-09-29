import { FC } from "react";
import Icons from "../core/Icons";
import colors from "@/styles/colors";
import { cn } from "@/styles/utils";
import Typography from "../core/Typography";

type ReviewStarsProps = {
  className?: string;
  showLegend?: boolean;
  stars: number;
  size?: number;
  onChange?: (starts: number) => void;
};

const ReviewStars: FC<ReviewStarsProps> = ({
  className,
  showLegend,
  stars,
  size,
  onChange,
}) => {
  const handleChange = (index: number) => {
    if (onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div
      className={cn("relative", className, {
        "pb-5": showLegend,
      })}
    >
      <div className={cn("flex", { "gap-1": onChange == null })}>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => handleChange(i)}
              className={cn("rounded-full", {
                "cursor-default": onChange == null,
                "hover:bg-slate-200 p-1": onChange != null,
              })}
            >
              <div className="flex relative">
                <Icons.StarHalf
                  size={size}
                  color={colors.secondary.DEFAULT}
                  className={cn("absolute", {
                    "fill-secondary": stars > i,
                  })}
                />
                <Icons.StarHalf
                  size={size}
                  color={colors.secondary.DEFAULT}
                  className={cn("-scale-x-100", {
                    "fill-secondary": stars > i + 0.5,
                  })}
                />
              </div>
            </button>
          ))}
      </div>
      {showLegend && (
        <>
          <div className="absolute">
            <Typography color="muted" size="xs">
              Malo
            </Typography>
          </div>
          <div className="absolute -right-4">
            <Typography color="muted" size="xs">
              Excelente
            </Typography>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewStars;
