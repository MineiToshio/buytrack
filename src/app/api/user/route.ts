import { apiResponses } from "@/helpers/api";
import { authOptions } from "@/helpers/auth";
import { updateUser } from "@/queries/user";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { z } from "zod";

const reqPutSchema = z.object({
  userId: z.string(),
  user: z.object({
    name: z.string(),
    currencyId: z.string(),
  }),
});

export const PUT = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const user = await getServerSession(authOptions).then((res) => res?.user);

    const { userId, user: userToUpdate } = reqPutSchema.parse(body);

    if (!user || user.id !== userId) {
      return apiResponses().unauthorized;
    }

    await updateUser(userId, userToUpdate);

    return apiResponses({
      id: userId,
      ...userToUpdate,
    }).success;
  } catch (error) {
    return apiResponses(error).error;
  }
};
