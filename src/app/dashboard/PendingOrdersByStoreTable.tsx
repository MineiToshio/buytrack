import Typography from "@/components/core/Typography";
import SimpleTable, { SimpleTableColumns } from "@/core/SimpleTable";
import type { PendingOrdersByStore } from "@/queries/dashboard";
import { FC } from "react";

type PendingOrdersByStoreTableProps = {
  data: PendingOrdersByStore;
};

const COLUMNS: SimpleTableColumns = [
  {
    title: "Tienda",
    dataAttribute: "store",
    align: "left",
  },
  {
    title: "Cantidad",
    dataAttribute: "count",
  },
  {
    title: "Deuda",
    dataAttribute: "remainingPaymentText",
  },
];

const PendingOrdersByStoreTable: FC<PendingOrdersByStoreTableProps> = ({
  data,
}) => (
  <div className="flex flex-col">
    <Typography className="font-semibold">
      ÓRDENES PENDIENTES POR TIENDA
    </Typography>
    <Typography size="sm" className="mb-6">
      Aquí puedes ver la cantidad de órdenes que aún no han sido entregadas,
      organizadas por tienda.
    </Typography>
    <SimpleTable data={data} columns={COLUMNS} dataKeyAttribute="storeId" />
  </div>
);

export default PendingOrdersByStoreTable;
