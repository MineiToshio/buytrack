import Typography from "@/components/core/Typography";
import ReviewStars from "@/components/modules/ReviewStars";
import { formatTimeAgo } from "@/helpers/utils";
import { cn } from "@/styles/utils";
import { StoreReview } from "@prisma/client";
import { FC } from "react";

type StoreReviewsProps = {
  reviews?: StoreReview[];
  totalRating?: number;
};

const StoreReviews: FC<StoreReviewsProps> = ({ reviews, totalRating }) => {
  if (
    reviews == null ||
    reviews.length === 0 ||
    totalRating == null ||
    totalRating === 0
  ) {
    return null;
  }

  return (
    <div className="flex flex-col mt-4">
      <Typography color="muted">Calificaciones</Typography>
      <div className="flex gap-5 flex-col md:flex-row">
        <div className="flex gap-2 items-center h-fit">
          <span className="font-bold text-6xl text-letters">{totalRating}</span>
          <div className="flex flex-col mt-2">
            <ReviewStars stars={totalRating} />
            <Typography color="muted" size="sm">
              {reviews.length} calificaciones
            </Typography>
          </div>
        </div>
        <div className="flex flex-col w-full">
          {reviews.map((r, i) => (
            <div
              key={r.id}
              className={cn("flex flex-col border-b", {
                "py-4": i > 0,
                "pb-4 pt-2": i === 0,
              })}
            >
              <div className="flex justify-between items-center">
                <ReviewStars stars={r.rating} size={18} />
                <Typography color="muted" size="sm">
                  {formatTimeAgo(r.createdDate)}
                </Typography>
              </div>
              <Typography size="sm" className="whitespace-pre-wrap mt-1">
                {r.comment}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreReviews;
