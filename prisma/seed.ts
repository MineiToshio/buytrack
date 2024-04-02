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

const addProductType = async () => {
  await prisma.productType.createMany({
    data: [
      { name: "Manga" },
      { name: "Funko" },
      { name: "TCG" },
      { name: "Cuidado Mangas" },
      { name: "Comics" },
    ],
  });
};

const addCountry = async () => {
  await prisma.country.createMany({
    data: [
      { name: "USA" },
      { name: "Perú" },
      { name: "México" },
      { name: "Colombia" },
      { name: "Argentina" },
      { name: "Chile" },
      { name: "España" },
    ],
  });
};

const addProductsCountry = async () => {
  await prisma.productsCountry.createMany({
    data: [
      { name: "USA" },
      { name: "Perú" },
      { name: "México" },
      { name: "Colombia" },
      { name: "Argentina" },
      { name: "Chile" },
      { name: "España" },
    ],
  });
};

const main = async () => {
  try {
    await addCurrency();
    await addProductType();
    await addCountry();
    await addProductsCountry();
    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
};

main();
