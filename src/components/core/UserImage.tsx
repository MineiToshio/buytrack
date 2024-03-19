import { cn } from "@/styles/utils";
import Image from "next/image";
import { FC } from "react";

const DEFAULT_USER = "/images/user.png";

type UserImageProps = {
  src?: string | null;
  name?: string;
  size?: number;
  className?: string;
};

const UserImage: FC<UserImageProps> = ({ src, name, size, className }) => {
  return (
    <Image
      src={src ?? DEFAULT_USER}
      alt={name ?? "Usuario"}
      width={size ?? 40}
      height={size ?? 40}
      className={cn("rounded-full", className)}
    />
  );
};

export default UserImage;
