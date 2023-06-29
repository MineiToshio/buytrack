"use client";

import Button from "@/core/Button";
import Icons from "@/core/Icons";
import Input from "@/core/Input";
import Typography from "@/core/Typography";
import {
  ArrayPath,
  Control,
  UseFormRegister,
  UseFormSetFocus,
  useFieldArray,
} from "react-hook-form";
import { OrderFormType, Product } from "./OrderForm";
import { FC, KeyboardEvent, useCallback, useEffect } from "react";
import { cn } from "@/styles/utils";
import { ErrorArrayField } from "@/types/reactHookForms";

type OrderFormProductsProps = {
  control: Control<OrderFormType>;
  formField: ArrayPath<OrderFormType>;
  register: UseFormRegister<OrderFormType>;
  setFocus: UseFormSetFocus<OrderFormType>;
  errors?: ErrorArrayField<Product>
};

type InputAttribute = "product" | "price";
type InputData = { index: number; attribute: InputAttribute };

const OrderFormProducts: FC<OrderFormProductsProps> = ({
  control,
  register,
  formField,
  setFocus,
  errors,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: formField,
  });

  const addNewRow = useCallback(
    () => append({ product: "", price: undefined }),
    [append],
  );

  useEffect(() => {
    if (fields.length === 0) addNewRow();
  }, [addNewRow, fields.length]);

  const getInputData = (e: KeyboardEvent<HTMLInputElement>): InputData => {
    const target = e.target as HTMLInputElement;
    const name = target.name;
    const nameParts = name.split(".");

    return {
      index: Number(nameParts[1]),
      attribute: nameParts[2] as InputAttribute,
    };
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addNewRow();
    } else if (e.ctrlKey) {
      const { index, attribute } = getInputData(e);

      if (e.key === "ArrowRight") {
        setFocus(`products.${index}.price`);
      } else if (e.key === "ArrowLeft") {
        setFocus(`products.${index}.product`);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (index > 0) {
          setFocus(`products.${index - 1}.${attribute}`);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();

        if (index < fields.length) {
          setFocus(`products.${index + 1}.${attribute}`);
        }
      }
    }
  };

  return (
    <div className="mt-6 flex w-full max-w-xl flex-col gap-2">
      <div className="flex gap-4">
        <div className="flex w-[calc(75%-24px)] items-center">
          <Typography color="muted">Producto</Typography>
          <Button
            variant="text"
            className="ml-2 p-0"
            onClick={addNewRow}
            title="Agregar producto"
          >
            <Icons.Add />
          </Button>
        </div>
        <div className="flex w-1/4 items-center">
          <Typography color="muted">Precio</Typography>
        </div>
        {fields.length > 1 && <div className={`w-[24px]`} />}
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-4">
          <Input
            variant="standard"
            className={cn("w-[calc(75%-24px)]", { "border-error": !!errors?.[index]?.product })}
            placeholder="Producto"
            autoComplete="off"
            onKeyDown={handleKeyDown}
            {...register(`products.${index}.product`, { required: true })}
          />
          <Input
            variant="standard"
            className="w-1/4"
            placeholder="50.00"
            type="number"
            autoComplete="off"
            min={0}
            onKeyDown={handleKeyDown}
            {...register(`products.${index}.price`, { min: 0 })}
          />
          {fields.length > 1 && (
            <Button
              variant="text"
              className="w-[24px] p-0"
              onClick={() => remove(index)}
              title="Eliminar producto"
            >
              <Icons.Delete />
            </Button>
          )}
        </div>
      ))}
      <div className="hidden flex-col sm:flex">
        <Typography size="xs" color="muted">
          * Puedes usar estos atajos de teclado:
        </Typography>
        <Typography size="xs" color="muted">
          - Enter: Agrega una nueva fila de producto.
        </Typography>
        <Typography size="xs" color="muted">
          - Control + Una de las flechas: Moverse entre las celdas.
        </Typography>
      </div>
    </div>
  );
};

export default OrderFormProducts;
