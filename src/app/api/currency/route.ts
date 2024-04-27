import { apiResponses } from "@/helpers/api";
import { authOptions } from "@/helpers/auth";
import {
  createCurrency,
  getCurrencies,
  getCurrencyByName,
} from "@/queries/currency";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { z } from "zod";

const reqPostSchema = z.object({
  name: z.string(),
  symbol: z.string(),
});

export const GET = async () => {
  try {
    const currencies = await getCurrencies();
    return apiResponses(currencies).success;
  } catch (error) {
    return apiResponses(error).error;
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const user = await getServerSession(authOptions).then((res) => res?.user);

    if (!user) {
      return apiResponses().unauthorized;
    }

    const { name, symbol } = reqPostSchema.parse(body);

    const existingCurrency = await getCurrencyByName(name);

    if (existingCurrency) {
      return apiResponses(`You already have a currency named ${name}.`)
        .badRequest;
    }

    const newCurrency = await createCurrency({ name, symbol });
    return apiResponses(newCurrency).success;
  } catch (error) {
    return apiResponses(error).error;
  }
};
