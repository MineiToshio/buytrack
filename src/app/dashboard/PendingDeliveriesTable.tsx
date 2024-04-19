"use client";

import EmptyTableBody from "@/components/core/EmptyTableBody";
import Icons from "@/components/core/Icons";
import Typography from "@/components/core/Typography";
import SortArrow from "@/components/modules/SortArrow";
import { sortDates, sortText } from "@/helpers/sort";
import { formatDate } from "@/helpers/utils";
import { cn } from "@/styles/utils";
import { DeliveryFull } from "@/types/prisma";
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

type PendingDeliveriesTableProps = {
  data: DeliveryFull[];
};

const columnHelper = createColumnHelper<DeliveryFull>();

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
      sortingFn: (rowA: Row<DeliveryFull>, rowB: Row<DeliveryFull>) =>
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
      sortingFn: (rowA: Row<DeliveryFull>, rowB: Row<DeliveryFull>) =>
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
    id: "deliveryUrl",
    size: 40,
    cell: (info) => (
      <div className="flex w-full justify-center">
        <Link
          href={`/deliveries/${info.getValue()}`}
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

const PendingDeliveriesTable: FC<PendingDeliveriesTableProps> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "approximateDeliveryDate",
      desc: false,
    },
  ]);

  const table = useReactTable({
    data: data ?? [],
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
      <Typography className="font-semibold">ENTREGAS PENDIENTES</Typography>
      <Typography size="sm" className="mb-6">
        Aquí puedes ver todos los envíos que están pendientes de entrega.
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
            {table.getRowModel().rows.length > 0 ? (
              <>
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
                        <td
                          colSpan={row.getVisibleCells().length}
                          className="p-2"
                        >
                          <div className="flex w-full flex-col pb-6 pl-10 md:flex-row">
                            <div className="flex w-full flex-col gap-2">
                              {row.original.currier && (
                                <div className="flex gap-2">
                                  <Typography className="font-semibold">
                                    Courier
                                  </Typography>
                                  <Typography>
                                    {row.original.currier}
                                  </Typography>
                                </div>
                              )}
                              {row.original.tracking && (
                                <div className="flex gap-2">
                                  <Typography className="font-semibold">
                                    Tracking
                                  </Typography>
                                  <Typography>
                                    {row.original.tracking}
                                  </Typography>
                                </div>
                              )}
                              <div className="flex flex-col">
                                <Typography className="font-semibold">
                                  {`${
                                    row.original.orderProducts.length
                                  } Producto${
                                    row.original.orderProducts.length > 1
                                      ? "s"
                                      : ""
                                  }`}
                                </Typography>
                                <table className="w-fit table-auto">
                                  <tbody>
                                    {row.original.orderProducts.map((r, i) => (
                                      <tr key={r.id}>
                                        <td className="pr-5">
                                          <Typography>
                                            {r.productName}
                                          </Typography>
                                        </td>
                                        <td>
                                          <Typography>
                                            {r.price
                                              ? `${row.original.currency.name} ${r.price}`
                                              : `${row.original.currency.name} -`}
                                          </Typography>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </>
            ) : (
              <EmptyTableBody
                numberOfColumns={columns.length}
                emptyText="No tienes entregas registradas"
              />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingDeliveriesTable;
