import Link from "next/link";
import { FC } from "react";
import Logo from "@/components/core/Logo";
import { cn } from "@/styles/utils";
import { secondaryFont } from "@/styles/fonts";
import Button from "@/core/Button";

const LINKS = [
  {
    id: 1,
    text: "Dashboard",
    href: "/dashboard",
  },
  {
    id: 2,
    text: "Pedidos",
    href: "/pedidos",
  },
  {
    id: 3,
    text: "Tiendas",
    href: "/tiendas",
  },
];

const Navbar: FC = () => {
  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex h-20 w-full items-center justify-between bg-primary p-10">
      <div className="flex h-full items-center">
        <Link href="/">
          <Logo />
        </Link>
        <div className="ml-4 flex">
          {LINKS.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={cn(
                "ml-4 text-lg font-semibold text-white hover:underline hover:decoration-2 hover:underline-offset-8",
                secondaryFont.className
              )}
            >
              {link.text}
            </Link>
          ))}
        </div>
        <div></div>
      </div>
      <div className="flex">
        <Button font="secondary" size="lg" color="white">
          Ingresar
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
