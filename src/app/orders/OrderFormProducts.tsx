"use client";

import Button from "@/core/Button";
import Icons from "@/core/Icons";
import Input from "@/core/Input";
import Typography from "@/core/Typography";
import { cn } from "@/styles/utils";
import { OrderFullProduct } from "@/types/prisma";
import { ErrorArrayField } from "@/types/reactHookForms";
import { FC, KeyboardEvent, useCallback, useEffect } from "react";
import {
  ArrayPath,
  Control,
  UseFormRegister,
  UseFormSetFocus,
  useFieldArray,
} from "react-hook-form";
import { OrderFormType, Product } from "./OrderForm";
import ProductStatusDot from "./ProductStatusDot";
import StatusLegend from "./StatusLegend";

type OrderFormProductsProps = {
  control: Control<OrderFormType>;
  formField: ArrayPath<OrderFormType>;
  register: UseFormRegister<OrderFormType>;
  setFocus: UseFormSetFocus<OrderFormType>;
  errors?: ErrorArrayField<Product>;
  readOnly: boolean;
  products?: OrderFullProduct[];
};

type InputAttribute = "productName" | "price";
type InputData = { index: number; attribute: InputAttribute };

const OrderFormProducts: FC<OrderFormProductsProps> = ({
  control,
  register,
  formField,
  setFocus,
  errors,
  readOnly,
  products,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: formField,
  });

  const addNewRow = useCallback(
    () => append({ productName: "", price: undefined }),
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
      e.preventDefault();
      addNewRow();
    } else if (e.ctrlKey) {
      const { index, attribute } = getInputData(e);

      if (e.key === "ArrowRight") {
        setFocus(`products.${index}.price`);
      } else if (e.key === "ArrowLeft") {
        setFocus(`products.${index}.productName`);
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
      } else if (e.key === "Delete") {
        if (fields.length > 1) {
          e.preventDefault();
          remove(index);
          const currentIndex = fields.length === index + 1 ? index - 1 : index;
          setFocus(`products.${currentIndex}.${attribute}`);
        }
      }
    }
  };

  return (
    <div className="mt-6 flex w-full max-w-xl flex-col gap-2">
      {products != null && <StatusLegend className="self-end" />}
      <div className="flex gap-4">
        <div
          className={cn("flex items-center", {
            "w-[calc(75%-24px)]": fields.length > 1 && !readOnly,
            "w-3/4": fields.length <= 1 || readOnly,
          })}
        >
          <Typography color="muted">Producto</Typography>
          {!readOnly && (
            <Button
              variant="text"
              className="ml-2 p-0"
              onClick={addNewRow}
              title="Agregar producto"
            >
              <Icons.Add />
            </Button>
          )}
        </div>
        <div className="flex w-1/4 items-center">
          <Typography color="muted">Precio</Typography>
        </div>
        {fields.length > 1 && !readOnly && <div className="w-[24px]" />}
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-4">
          <div
            className={cn("flex w-full items-center", {
              "w-[calc(75%-24px)]": fields.length > 1 && !readOnly,
              "w-3/4": fields.length <= 1 || readOnly,
            })}
          >
            {products && (
              <ProductStatusDot
                isDelivered={products[index].delivery?.delivered}
                className="mr-2"
              />
            )}
            <Input
              variant="standard"
              className={cn({
                "border-error": !!errors?.[index]?.productName,
              })}
              placeholder="Producto"
              autoComplete="off"
              readOnly={readOnly}
              onKeyDown={handleKeyDown}
              {...register(`products.${index}.productName`, { required: true })}
            />
          </div>
          <Input
            variant="standard"
            className="w-1/4"
            placeholder="50.00"
            type="number"
            autoComplete="off"
            min={0}
            readOnly={readOnly}
            onKeyDown={handleKeyDown}
            {...register(`products.${index}.price`, {
              min: 0,
              valueAsNumber: true,
            })}
          />
          {fields.length > 1 && !readOnly && (
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
      {!readOnly && (
        <div className="hidden flex-col sm:flex">
          <Typography size="xs" color="muted">
            * Puedes usar estos atajos de teclado:
          </Typography>
          <Typography size="xs" color="muted">
            - Enter: Agrega una nueva fila de producto.
          </Typography>
          <Typography size="xs" color="muted">
            - Control + Del: Eliminar la fila.
          </Typography>
          <Typography size="xs" color="muted">
            - Control + Una de las flechas: Moverse entre las celdas.
          </Typography>
        </div>
      )}
    </div>
  );
};

export default OrderFormProducts;
