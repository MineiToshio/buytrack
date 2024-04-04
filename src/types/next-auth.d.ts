/* eslint-disable no-unused-vars */
import type { Currency } from "@prisma/client";
import type { User } from "next-auth";
import "next-auth/jwt";

type UserId = string;

export type UserSession = User & {
  id: UserId;
  currency?: Currency | null;
};

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    currency?: Currency | null;
  }
}

declare module "next-auth" {
  interface Session {
    user: UserSession;
  }
}
