"use client";

import Input from "@/components/core/Input";
import Label from "@/components/core/Label";
import Select from "@/components/core/Select";
import Typography from "@/components/core/Typography";
import UserImage from "@/components/core/UserImage";
import { Currency, User } from "@prisma/client";
import { FC, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { formatOptions } from "@/hooks/useSelect";
import Button from "@/components/core/Button";
import { useMutation } from "@tanstack/react-query";
import { put } from "@/helpers/request";
import { UPDATE_USER } from "@/helpers/apiUrls";

type ProfileForm = {
  name: string;
  currencyId: string;
};

type ProfileFormProps = {
  user: User;
  currencies: Currency[];
};

const updateUser = (userId: string, data: ProfileForm) => {
  const user = {
    userId,
    user: data,
  };
  return put<User>(UPDATE_USER, user);
};

const ProfileForm: FC<ProfileFormProps> = ({ user, currencies }) => {
  const storeOptions = formatOptions(currencies);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileForm>();

  useEffect(() => {
    if (user) {
      setValue("name", user.name ?? "");
      setValue("currencyId", user.currencyId ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: ProfileForm) => updateUser(user.id, data),
  });

  const onSubmit: SubmitHandler<ProfileForm> = (data) => {
    mutate(data);
  };

  return (
    <div className="flex items-center flex-col w-64 gap-2">
      <UserImage src={user.image} size={80} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full"
      >
        <Label text="Nombre" className="w-full">
          <Input variant="standard" {...register("name", { required: true })} />
          {errors.name && (
            <Typography className="mt-1 text-error" size="xs">
              Este campo es obligatorio
            </Typography>
          )}
        </Label>
        <Label text="Moneda" className="w-full">
          <Controller
            name="currencyId"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <Select
                  options={storeOptions}
                  variant="standard"
                  placeholder="Ej. PEN, USD, MXM"
                  onChange={field.onChange}
                  value={field.value}
                />
                {errors.currencyId && (
                  <Typography className="mt-1 text-error" size="xs">
                    Este campo es obligatorio
                  </Typography>
                )}
              </>
            )}
          />
        </Label>
        <Button type="submit" isLoading={isLoading}>
          Guardar
        </Button>
      </form>
    </div>
  );
};

export default ProfileForm;
