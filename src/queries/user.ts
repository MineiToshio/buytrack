import { db } from "@/helpers/db";
import { User } from "@prisma/client";

export const getUserById = (id: string) => db.user.findFirst({ where: { id } });

export const updateUser = (userId: string, user: Partial<User>) =>
  db.user.update({
    data: {
      name: user.name,
      currencyId: user.currencyId,
    },
    where: { id: userId },
  });
