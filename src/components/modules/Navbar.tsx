import Icons from "@/core/Icons";
import Logo from "@/core/Logo";
import { authOptions } from "@/helpers/auth";
import { deliveryStatus } from "@/helpers/constants";
import { secondaryFont } from "@/styles/fonts";
import { cn } from "@/styles/utils";
import { OrderStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { ReactElement } from "react";
import BurgerMenu from "./BurgerMenu";
import GoogleAuthButton from "./GoogleAuthButton";
import UserButton from "./UserButton";

export type NavLink = {
  id: number;
  text: string;
  href: string;
  isPublic: boolean;
  Icon: ReactElement;
};

const LINKS = [
  {
    id: 1,
    text: "Dashboard",
    href: "/dashboard",
    isPublic: false,
    Icon: <Icons.Dashboard />,
  },
  {
    id: 2,
    text: "Tiendas",
    href: "/stores",
    isPublic: true,
    Icon: <Icons.Store />,
  },
  {
    id: 3,
    text: "Pedidos",
    href: `/orders?status=${OrderStatus.Open},${OrderStatus.In_Route},${OrderStatus.Partial_In_Route},${OrderStatus.Partial_Delivered}`,
    isPublic: false,
    Icon: <Icons.File />,
  },
  {
    id: 4,
    text: "Entregas",
    href: `/deliveries?status=${deliveryStatus.inRoute}`,
    isPublic: false,
    Icon: <Icons.Courier />,
  },
];

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  const linksToRender = LINKS.filter(
    (l) => l.isPublic || (session && !l.isPublic),
  );

  return (
    <div className="p-page fixed left-0 right-0 top-0 z-50 flex h-20 w-full items-center justify-between bg-primary drop-shadow-lg">
      <div className="flex h-full items-center">
        <Link href="/">
          <Logo />
        </Link>
        <div className="ml-4 hidden md:flex">
          {linksToRender.map((link) => {
            return (
              <Link
                key={link.id}
                href={link.href}
                className={cn(
                  "ml-4 text-lg font-semibold text-white hover:underline hover:decoration-2 hover:underline-offset-8",
                  secondaryFont.className,
                )}
              >
                {link.text}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex items-center">
        {session ? (
          <UserButton src={session.user.image} />
        ) : (
          <GoogleAuthButton />
        )}
        <BurgerMenu links={linksToRender} />
      </div>
    </div>
  );
};

export default Navbar;
