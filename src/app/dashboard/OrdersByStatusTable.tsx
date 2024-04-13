import Typography from "@/components/core/Typography";
import SimpleTable, { SimpleTableColumns } from "@/core/SimpleTable";
import { orderStatusLabel, orderStatusOrder } from "@/helpers/constants";
import { typeSafeObjectEntries } from "@/helpers/utils";
import type { OrderByStatus } from "@/queries/dashboard";
import { FC, useMemo } from "react";

type OrdersByStatusTableProps = {
  data: OrderByStatus;
};

const COLUMNS: SimpleTableColumns = [
  {
    title: "Estado",
    dataAttribute: "label",
    align: "left",
  },
  {
    title: "Cantidad",
    dataAttribute: "quantity",
  },
];

const OrdersByStatusTable: FC<OrdersByStatusTableProps> = ({ data }) => {
  const statusData = useMemo(
    () =>
      typeSafeObjectEntries(orderStatusLabel)
        .map(([key, label]) => ({
          key,
          label,
          // @ts-ignore type error won't ever happen
          quantity: data[key]?.count ?? 0,
        }))
        .sort(
          (itemA, itemB) =>
            orderStatusOrder[itemA.key] - orderStatusOrder[itemB.key],
        ),
    [data],
  );

  return (
    <div className="flex flex-col">
      <Typography className="font-semibold">ÓRDENES POR ESTADO</Typography>
      <Typography size="sm" className="mb-6">
        Aquí puedes ver la cantidad de órdenes realizadas, organizadas por su
        estado.
      </Typography>
      <SimpleTable data={statusData} columns={COLUMNS} dataKeyAttribute="key" />
    </div>
  );
};

export default OrdersByStatusTable;
