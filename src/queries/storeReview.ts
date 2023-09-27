import { db } from "@/helpers/db";
import { Prisma } from "@prisma/client";

type StoreReviewData =
  | (Prisma.Without<
      Prisma.StoreReviewCreateInput,
      Prisma.StoreReviewUncheckedCreateInput
    > &
      Prisma.StoreReviewUncheckedCreateInput)
  | (Prisma.Without<
      Prisma.StoreReviewUncheckedCreateInput,
      Prisma.StoreReviewCreateInput
    > &
      Prisma.StoreReviewCreateInput);

export const createStoreReview = (storeReview: StoreReviewData) =>
  db.storeReview.create({
    data: storeReview,
  });

export const updateStoreReview = (
  storeReviewId: string,
  rating?: number,
  comment?: string,
) =>
  db.storeReview.update({
    data: {
      rating,
      comment,
    },
    where: {
      id: storeReviewId,
    },
  });
