import Logo from "@/core/Logo";
import { secondaryFont } from "@/styles/fonts";
import { cn } from "@/styles/utils";
import { getServerSession } from "next-auth";
import Link from "next/link";
import GoogleAuthButton from "./GoogleAuthButton";
import { authOptions } from "@/helpers/auth";

const LINKS = [
  {
    id: 1,
    text: "Dashboard",
    href: "/dashboard",
    isPublic: false,
  },
  {
    id: 2,
    text: "Tiendas",
    href: "/stores",
    isPublic: true,
  },
  {
    id: 3,
    text: "Pedidos",
    href: "/orders",
    isPublic: false,
  },
  {
    id: 4,
    text: "Entregas",
    href: "/deliveries",
    isPublic: false,
  },
];

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  const linksToRender = LINKS.filter(
    (l) => l.isPublic || (session && !l.isPublic),
  );

  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex h-20 w-full items-center justify-between bg-primary p-4 md:p-10">
      <div className="flex h-full items-center">
        <Link href="/">
          <Logo />
        </Link>
        <div className="ml-4 flex">
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
        <div></div>
      </div>
      <div className="flex">
        <GoogleAuthButton />
      </div>
    </div>
  );
};

export default Navbar;
