"use client";

import SortArrow from "@/components/modules/SortArrow";
import Icons from "@/core/Icons";
import Typography from "@/core/Typography";
import { orderStatusLabel } from "@/helpers/constants";
import { sortDates, sortText } from "@/helpers/sort";
import { formatDate } from "@/helpers/utils";
import { OrderForThisMonth } from "@/queries/dashboard";
import { cn } from "@/styles/utils";
import {
  Row,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { FC, Fragment, useState } from "react";
import CollapseTableInfo from "./CollapseTableInfo";

type PendingOrdersThisMonthTableProps = {
  data: OrderForThisMonth[];
};

const columnHelper = createColumnHelper<OrderForThisMonth>();

const columns = [
  columnHelper.accessor((row) => row, {
    id: "expander",
    size: 40,
    header: () => null,
    cell: ({ row }) => (
      <div className="flex w-full justify-start">
        <button
          {...{
            onClick: row.getToggleExpandedHandler(),
            style: { cursor: "pointer" },
          }}
        >
          {row.getIsExpanded() ? (
            <Icons.ChevronDown className="text-letters" />
          ) : (
            <Icons.ChevronRight className="text-letters" />
          )}
        </button>
      </div>
    ),
  }),
  columnHelper.accessor(
    (row) => ({ name: row.store.name, url: row.store.url }),
    {
      id: "store",
      sortingFn: (rowA: Row<OrderForThisMonth>, rowB: Row<OrderForThisMonth>) =>
        sortText(rowA.original.store.name, rowB.original.store.name),
      cell: (info) => {
        const store = info.getValue();
        return (
          <Link href={`/stores/${store.url}`}>
            <Typography>{store.name}</Typography>
          </Link>
        );
      },
      header: () => "TIENDA",
    },
  ),
  columnHelper.accessor(
    (row) => ({
      start: row.minApproximateDeliveryDate,
      end: row.maxApproximateDeliveryDate,
    }),
    {
      id: "approximateDeliveryDate",
      sortingFn: (rowA: Row<OrderForThisMonth>, rowB: Row<OrderForThisMonth>) =>
        sortDates(
          rowA.original.minApproximateDeliveryDate,
          rowB.original.minApproximateDeliveryDate,
        ),
      cell: (info) => {
        const date = info.getValue();
        if (date.start && date.end)
          return (
            <Typography>{`${formatDate(date.start)} - ${formatDate(
              date.end,
            )}`}</Typography>
          );
        else {
          return <Typography>-</Typography>;
        }
      },
      header: () => "ENTREGA APROX.",
    },
  ),
  columnHelper.accessor((row) => row.id, {
    id: "orderUrl",
    size: 40,
    cell: (info) => (
      <div className="flex w-full justify-center">
        <Link
          href={`/orders/${info.getValue()}`}
          className="text-letters hover:text-gray-500"
          title="Ver más"
        >
          <Icons.View />
        </Link>
      </div>
    ),
    header: () => null,
  }),
];

const PendingOrdersThisMonthTable: FC<PendingOrdersThisMonthTableProps> = ({
  data,
}) => {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "approximateDeliveryDate",
      desc: false,
    },
  ]);

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      minSize: 0,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
    state: {
      sorting,
    },
    enableSortingRemoval: false,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col">
      <Typography className="font-semibold">
        PEDIDOS PENDIENTES DEL MES
      </Typography>
      <Typography size="sm" className="mb-6">
        Aquí puedes ver todos los pedidos que están programados para este mes.
      </Typography>
      <div className="w-full overflow-x-auto rounded-md bg-slate-50">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b bg-slate-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-2"
                    style={{
                      width:
                        header.getSize() === Number.MAX_SAFE_INTEGER
                          ? "auto"
                          : header.getSize(),
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-1">
                        <Typography
                          className={cn("text-left", {
                            "cursor-pointer select-none":
                              header.column.getCanSort(),
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </Typography>
                        <SortArrow
                          sortDirection={header.column.getIsSorted()}
                        />
                      </div>
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
                    "bg-slate-100": i % 2 !== 0,
                  })}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="p-2"
                      style={{
                        width:
                          cell.column.getSize() === Number.MAX_SAFE_INTEGER
                            ? "auto"
                            : cell.column.getSize(),
                      }}
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
                      "bg-slate-100": i % 2 !== 0,
                    })}
                  >
                    <td colSpan={row.getVisibleCells().length} className="p-2">
                      <div className="flex w-full flex-col pb-6 pl-10 gap-2">
                        <CollapseTableInfo
                          title="Fecha del Pedido"
                          info={formatDate(row.original.orderDate)}
                        />
                        <CollapseTableInfo
                          title="Estado"
                          info={orderStatusLabel[row.original.status]}
                        />
                        <div className="flex flex-col">
                          <Typography className="font-semibold">
                            {`${row.original.products.length} Producto${
                              row.original.products.length > 1 ? "s" : ""
                            } (${row.original.currency.symbol} ${
                              row.original.productsCost
                            })`}
                          </Typography>
                          <table className="w-fit table-auto">
                            <tbody>
                              {row.original.products.map((r) => (
                                <tr key={r.id}>
                                  <td className="pb-1 pr-5">
                                    <Typography>{r.productName}</Typography>
                                  </td>
                                  <td className="pb-1 pr-5">
                                    <Typography>
                                      {r.price
                                        ? `${row.original.currency.symbol} ${r.price}`
                                        : `${row.original.currency.symbol} -`}
                                    </Typography>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingOrdersThisMonthTable;
