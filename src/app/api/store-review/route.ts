import { apiResponses } from "@/helpers/api";
import { authOptions } from "@/helpers/auth";
import { createStoreReview, updateStoreReview } from "@/queries/storeReview";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { z } from "zod";

const reqPostSchema = z.object({
  storeId: z.string(),
  orderId: z.string().optional(),
  rating: z.number(),
  comment: z.string(),
});

const reqPutSchema = z.object({
  storeReviewId: z.string(),
  rating: z.number().optional(),
  comment: z.string().optional(),
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const user = await getServerSession(authOptions).then((res) => res?.user);

    if (!user) {
      return apiResponses().unauthorized;
    }

    const data = reqPostSchema.parse(body);

    const newStoreReview = await createStoreReview({
      userId: user.id,
      ...data,
    });
    return apiResponses(newStoreReview).success;
  } catch (error) {
    return apiResponses(error).error;
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const user = await getServerSession(authOptions).then((res) => res?.user);

    if (!user) {
      return apiResponses().unauthorized;
    }

    const { storeReviewId, comment, rating } = reqPutSchema.parse(body);

    const newStoreReview = await updateStoreReview(
      storeReviewId,
      rating,
      comment,
    );
    return apiResponses(newStoreReview).success;
  } catch (error) {
    return apiResponses(error).error;
  }
};
