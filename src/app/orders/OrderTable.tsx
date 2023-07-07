"use client";

import Icons from "@/components/core/Icons";
import Typography from "@/components/core/Typography";
import { formatDate } from "@/helpers/utils";
import { cn } from "@/styles/utils";
import { OrderFull } from "@/types/prisma";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { FC, Fragment } from "react";

type Props = {
  orders: OrderFull[];
};

const columnHelper = createColumnHelper<OrderFull>();

const columns = [
  columnHelper.accessor((row) => row, {
    id: "expander",
    size: 24,
    header: () => null,
    cell: ({ row }) => (
      <div className="flex w-full justify-start">
        <button
          {...{
            onClick: row.getToggleExpandedHandler(),
            style: { cursor: "pointer" },
          }}
        >
          {row.getIsExpanded() ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
        </button>
      </div>
    ),
  }),
  columnHelper.accessor((row) => row.orderDate, {
    id: "orderDate",
    size: 150,
    cell: (info) => {
      const date = info.getValue();
      return (
        <Typography className="text-center">
          {date != null ? formatDate(date) : "-"}
        </Typography>
      );
    },
    header: () => <Typography>Fecha de Pedido</Typography>,
  }),
  columnHelper.accessor(
    (row) => ({ name: row.store.name, url: row.store.url }),
    {
      id: "store",
      cell: (info) => {
        const store = info.getValue();
        return <Link href={`/stores/${store.url}`}>{store.name}</Link>;
      },
      header: () => <Typography>Tienda</Typography>,
    },
  ),
  columnHelper.accessor(
    (row) => ({ cost: row.productsCost, currency: row.currency.name }),
    {
      id: "price",
      size: 70,
      cell: (info) => {
        const price = info.getValue();
        return (
          <Typography className="text-center">{`${price.currency} ${price.cost}`}</Typography>
        );
      },
      header: () => <Typography>Precio</Typography>,
    },
  ),
  columnHelper.accessor(
    (row) => ({
      start: row.minApproximateDeliveryDate,
      end: row.maxApproximateDeliveryDate,
    }),
    {
      id: "approximateDeliveryDate",
      cell: (info) => {
        const date = info.getValue();
        if (date.start && date.end)
          return (
            <Typography className="text-center">{`${formatDate(
              date.start,
            )} - ${formatDate(date.end)}`}</Typography>
          );
        else {
          return <Typography className="text-center">-</Typography>;
        }
      },
      header: () => <Typography>Fecha aprox. de entrega</Typography>,
    },
  ),
  columnHelper.accessor((row) => row.id, {
    id: "orderUrl",
    size: 24,
    cell: (info) => (
      <div className="flex w-full justify-center">
        <Link href={`/orders/${info.getValue()}`}>
          <Icons.View />
        </Link>
      </div>
    ),
    header: () => null,
  }),
];

const OrderTable: FC<Props> = ({ orders }) => {
  const table = useReactTable({
    data: orders,
    columns,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {orders && orders.length > 0 ? (
        <div className="w-full overflow-x-auto rounded-md bg-slate-50">
          <table className="w-full table-fixed">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="p-2"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, i) => (
                <Fragment key={row.id}>
                  <tr
                    className={cn({
                      "border-b":
                        i < table.getRowModel().rows.length - 1 &&
                        !row.getIsExpanded(),
                    })}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="p-2"
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                  {row.getIsExpanded() && (
                    <tr
                      className={cn({
                        "border-b":
                          i < table.getRowModel().rows.length - 1 &&
                          row.getIsExpanded(),
                      })}
                    >
                      <td
                        colSpan={row.getVisibleCells().length}
                        className="p-2"
                      >
                        <Typography className="font-bold">Productos</Typography>
                        <table className="table-auto">
                          <tbody>
                            {row.original.products.map((r, i) => (
                              <tr key={r.id}>
                                <td className="pr-5">
                                  <Typography>{i + 1}.</Typography>
                                </td>
                                <td className="pr-5">
                                  <Typography>{r.productName}</Typography>
                                </td>
                                <td>
                                  <Typography>
                                    {r.price
                                      ? `${row.original.currency.name} ${r.price}`
                                      : "-"}
                                  </Typography>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-4 text-center">
          <Typography>
            Aún no tienes órdenes. Puedes agregar una desde{" "}
            <Link
              href="/orders/new"
              className="text-primary hover:text-green-600"
            >
              aquí
            </Link>
            .
          </Typography>
        </div>
      )}
    </>
  );
};

export default OrderTable;
