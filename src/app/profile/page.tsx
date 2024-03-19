import Heading from "@/components/core/Heading";
import { authOptions } from "@/helpers/auth";
import { getCurrencies } from "@/queries/currency";
import { getUserById } from "@/queries/user";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";
import ProfileForm from "./ProfileForm";

const page: FC = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const currencies = await getCurrencies();
  const user = await getUserById(session.user.id);

  return (
    <div className="flex flex-col items-center px-4 pt-8 md:px-10">
      <Heading size="sm" className="mb-6 md:mb-10">
        Editar Usuario
      </Heading>
      <ProfileForm user={user!} currencies={currencies} />
    </div>
  );
};

export default page;
