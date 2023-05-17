"use client";

import Button from "@/core/Button";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";

const GoogleAuthButton = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { status } = useSession();

  const handleGoogleAuth = async () => {
    setIsLoading(true);

    try {
      if (status === "authenticated") {
        await signOut();
      } else {
        await signIn("google");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      onClick={handleGoogleAuth}
      isLoading={isLoading}
      font="secondary"
      size="lg"
      color="white"
    >
      {status === "authenticated" ? "Salir" : "Ingresar"}
    </Button>
  );
};

export default GoogleAuthButton;
