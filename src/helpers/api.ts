import { NextResponse } from "next/server";
import { z } from "zod";

export const apiResponses = (data?: unknown) => ({
  unauthorized: NextResponse.json(
    { error: "Unauthorized to perform this action." },
    { status: 401 },
  ),
  notFound: NextResponse.json({ error: data ?? "Not found." }, { status: 404 }),
  badRequest: NextResponse.json(
    { error: data ?? "Bad request." },
    { status: 400 },
  ),
  error:
    data instanceof z.ZodError
      ? NextResponse.json({ data: data.issues }, { status: 400 })
      : NextResponse.json({ data }, { status: 500 }),
  success: NextResponse.json(data, { status: 200 }),
});
