"use client";

import Button from "@/core/Button";
import Icons from "@/core/Icons";
import Logo from "@/core/Logo";
import useRouter from "@/hooks/useRouter";
import { NavLink } from "@/modules/Navbar";
import { secondaryFont } from "@/styles/fonts";
import { cn } from "@/styles/utils";
import { FC, useState } from "react";

type BurgerMenuProps = {
  links: NavLink[];
};

const BurgerMenu: FC<BurgerMenuProps> = ({ links }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsMenuOpen((m) => !m);

  const goToLink = (url: string) => {
    toggleMenu();
    router.push(url);
  };

  return (
    <>
      <Button
        variant="icon"
        color="white"
        className="ml-4 inline-flex md:hidden"
        onClick={toggleMenu}
      >
        <Icons.Menu />
      </Button>
      <div
        className={cn(
          "p-page fixed left-0 right-0 top-0 z-50 h-screen translate-x-full bg-white transition duration-700",
          {
            "translate-x-0": isMenuOpen,
          },
        )}
      >
        <Button
          variant="icon"
          className="absolute right-6 top-6"
          onClick={toggleMenu}
        >
          <Icons.Cancel size={40} />
        </Button>
        <button className="mt-16" onClick={() => goToLink("/")}>
          <Logo color="primary" className="text-5xl" />
        </button>
        <div className="mt-16 flex flex-col gap-4">
          {links.map((link) => {
            return (
              <button
                key={link.id}
                onClick={() => goToLink(link.href)}
                className={cn(
                  "flex items-center gap-2 text-3xl text-letters hover:underline hover:decoration-2 hover:underline-offset-8",
                  secondaryFont.className,
                )}
              >
                {link.Icon}
                {link.text}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BurgerMenu;
