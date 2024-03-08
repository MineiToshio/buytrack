import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const addCurrency = async () => {
  await prisma.currency.createMany({
    data: [
      {
        name: "PEN",
        symbol: "S/",
      },
      {
        name: "USD",
        symbol: "$",
      },
      {
        name: "MXN",
        symbol: "$",
      },
      {
        name: "COL",
        symbol: "$",
      },
      {
        name: "ARG",
        symbol: "$",
      },
    ],
  });
};

const main = async () => {
  try {
    await addCurrency();
    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
};

main();
