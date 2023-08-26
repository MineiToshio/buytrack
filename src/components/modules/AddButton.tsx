"use client";

import { FC, FormEvent, useState } from "react";
import Icons from "@/core/Icons";
import Modal from "@/modules/Modal";
import Typography from "../core/Typography";
import Input from "@/core/Input";
import Button from "@/core/Button";
import { SubmitHandler, useForm } from "react-hook-form";

type FormType = {
  value: string;
};

type AddButtonProps = {
  title: string;
  onAdd: (value: string) => void;
};

const AddButton: FC<AddButtonProps> = ({ title, onAdd }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>();

  const toggleOpen = () => setIsOpen((o) => !o);

  const handleClose = () => {
    toggleOpen();
    reset();
  };

  const onSubmit: SubmitHandler<FormType> = ({ value }) => {
    toggleOpen();
    onAdd(value);
  };

  const onBeforeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    return handleSubmit(onSubmit)(e);
  };

  return (
    <>
      <button type="button" className="group" onClick={handleClose}>
        <Icons.AddCircle className="text-primary group-hover:text-green-600" />
      </button>
      <Modal open={isOpen} onClose={toggleOpen}>
        <form className="p-4" onSubmit={onBeforeSubmit}>
          <Typography className="mb-4 font-semibold" size="lg">
            {title}
          </Typography>
          <Input
            variant="standard"
            {...register("value", { required: true })}
          />
          {errors.value && (
            <Typography className="mt-1 text-error" size="xs">
              Este campo es obligatorio
            </Typography>
          )}
          <div className="mt-6 flex justify-end">
            <Button
              variant="outline"
              className="mr-2"
              onClick={handleClose}
              StartIcon={Icons.Cancel}
            >
              Cancelar
            </Button>
            <Button type="submit" StartIcon={Icons.Save}>
              Guardar
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddButton;
