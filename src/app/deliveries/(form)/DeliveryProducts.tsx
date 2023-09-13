"use client";

import Checkbox from "@/components/core/Checkbox";
import Typography from "@/core/Typography";
import { formatDate } from "@/helpers/utils";
import Accordion from "@/modules/Accordion";
import { OrderWithProducts } from "@/types/prisma";
import { FC } from "react";

type DeliveryFormProps = {
  orders: OrderWithProducts[];
  value: string[];
  onChange: (value: string[]) => void;
};

const DeliveryProducts: FC<DeliveryFormProps> = ({
  orders,
  value,
  onChange,
}) => {
  const handleChange = (productId: string, checked: boolean) => {
    let newValue: string[] = [];
    if (checked) {
      newValue = [...value, productId];
    } else {
      newValue = value.filter((v) => v !== productId);
    }
    onChange(newValue);
  };

  return (
    <>
      {orders.length > 0 ? (
        <>
          {orders.map((o) => (
            <Accordion
              key={o.id}
              title={formatDate(o.orderDate)}
              className="mb-2"
            >
              {o.products.map((p) => (
                <Checkbox
                  key={p.id}
                  label={p.productName}
                  checked={value && value.includes(p.id)}
                  onChange={(e) => handleChange(p.id, e.target.checked)}
                />
              ))}
            </Accordion>
          ))}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-center">
          <Typography>
            Selecciona una tienda para escoger los productos.
          </Typography>
        </div>
      )}
    </>
  );
};

export default DeliveryProducts;
