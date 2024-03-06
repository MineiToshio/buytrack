import { cn } from "@/styles/utils";
import Image from "next/image";
import { FC } from "react";

const DEFAULT_USER = "/images/user.png";

type UserImageProps = {
  src?: string | null;
  name?: string;
  className?: string;
};

const UserImage: FC<UserImageProps> = ({ src, name, className }) => {
  return (
    <Image
      src={src ?? DEFAULT_USER}
      alt={name ?? "Usuario"}
      width={40}
      height={40}
      className={cn("rounded-full", className)}
    />
  );
};

export default UserImage;
