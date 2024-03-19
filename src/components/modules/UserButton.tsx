"use client";

import Icons from "@/core/Icons";
import Typography from "@/core/Typography";
import UserImage from "@/core/UserImage";
import useBoolean from "@/hooks/useBoolean";
import useHandleOutsideClick from "@/hooks/useHandleOutsideClick";
import { cn } from "@/styles/utils";
import { FC, useMemo } from "react";
import { signOut } from "next-auth/react";
import useRouter from "@/hooks/useRouter";

type UserButton = {
  src?: string | null;
  name?: string;
};

const UserButton: FC<UserButton> = ({ src, name }) => {
  const route = useRouter();

  const options = useMemo(
    () => [
      {
        id: "editProfile",
        name: "Editar Perfil",
        Icon: Icons.User,
        onClick: () => route.push("/profile"),
      },
      {
        id: "signOut",
        name: "Salir",
        Icon: Icons.LogOut,
        onClick: async () => await signOut(),
      },
    ],
    [route],
  );

  const {
    state: areOptionsOpen,
    setFalse: hideOptions,
    toggleState: toggleOptions,
  } = useBoolean(false);

  const ref = useHandleOutsideClick(hideOptions);

  return (
    <div className="relative" ref={ref}>
      <button className="group relative cursor-pointer" onClick={toggleOptions}>
        <div className="rounded-full bg-black opacity-70 w-4 h-4 flex justify-center items-center absolute right-0 bottom-0 z-20">
          <Icons.ChevronDown className="absolute text-white" size={15} />
        </div>
        <div className="bg-white z-10 absolute inset-0 rounded-full opacity-0 group-hover:opacity-25 transition-opacity" />
        <UserImage src={src} name={name} className="shadow-md" />
      </button>
      {areOptionsOpen && (
        <div className="absolute bg-gray-100 right-0 top-11 rounded-md">
          <ul className="w-36">
            {options.map((option, i) => (
              <li
                key={option.id}
                className={cn(
                  "px-3 py-2 border-b flex items-center cursor-pointer hover:bg-gray-200",
                  {
                    "border-gray-300": options.length !== i + 1,
                    "rounded-b-md": options.length === i + 1,
                    "rounded-t-md": i === 0,
                  },
                )}
                onClick={() => {
                  option.onClick();
                  hideOptions();
                }}
              >
                <option.Icon size={15} />
                <Typography className="ml-1">{option.name}</Typography>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserButton;
