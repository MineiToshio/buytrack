import Typography from "@/components/core/Typography";
import SimpleTable, { SimpleTableColumns } from "@/core/SimpleTable";
import { deliveryStatus, deliveryStatusData } from "@/helpers/constants";
import type { DeliveryByStatus } from "@/queries/dashboard";
import { FC, useMemo } from "react";

type DeliveriesByStatusTableProps = {
  data: DeliveryByStatus;
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

const DeliveriesByStatusTable: FC<DeliveriesByStatusTableProps> = ({
  data,
}) => {
  const statusData = useMemo(
    () =>
      Object.entries(deliveryStatusData)
        .map(([key, deliveryData]) => ({
          key,
          label: deliveryData.label,
          // @ts-ignore type error won't ever happen
          quantity: data[key] ?? 0,
        }))
        .filter((d) => d.key !== deliveryStatus.noDelivery)
        .sort(
          (itemA, itemB) =>
            deliveryStatusData[itemA.key].order -
            deliveryStatusData[itemB.key].order,
        ),
    [data],
  );

  return (
    <div className="flex flex-col">
      <Typography className="font-semibold">ENTREGAS POR ESTADO</Typography>
      <Typography size="sm" className="mb-6">
        Aquí puedes ver la cantidad de entregas realizadas, organizadas por su
        estado.
      </Typography>
      <SimpleTable data={statusData} columns={COLUMNS} dataKeyAttribute="key" />
    </div>
  );
};

export default DeliveriesByStatusTable;
