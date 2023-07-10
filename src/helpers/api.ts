import { NextResponse } from "next/server";
import { z } from "zod";

export const apiResponses = (data?: unknown) => ({
  unauthorized: NextResponse.json(
    {
      error: "Unauthorized to perform this action.",
    },
    { status: 401 },
  ),
  error:
    data instanceof z.ZodError
      ? NextResponse.json({ data: data.issues }, { status: 400 })
      : NextResponse.json({ data }, { status: 500 }),
  success: NextResponse.json(data, { status: 200 }),
});
