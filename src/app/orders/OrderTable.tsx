"use client";

import Chip from "@/components/core/Chip";
import Icons from "@/components/core/Icons";
import Typography from "@/components/core/Typography";
import SortArrow from "@/components/modules/SortArrow";
import {
  orderStatusColor,
  orderStatusLabel,
  orderStatusOrder,
} from "@/helpers/constants";
import { sortDates, sortNumbers, sortText } from "@/helpers/sort";
import { formatDate } from "@/helpers/utils";
import { cn } from "@/styles/utils";
import { OrderFull } from "@/types/prisma";
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
import OrderPaymentTable from "./OrderPaymentsTable";
import OrderProductStatus from "./OrderProductStatus";

type Props = {
  orders?: OrderFull[];
  hasFilters: boolean;
};

const columnHelper = createColumnHelper<OrderFull>();

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
  columnHelper.accessor((row) => row.orderDate, {
    id: "orderDate",
    sortingFn: (rowA: Row<OrderFull>, rowB: Row<OrderFull>) =>
      sortDates(rowA.original.orderDate, rowB.original.orderDate),
    cell: (info) => {
      const date = info.getValue();
      return <Typography>{date != null ? formatDate(date) : "-"}</Typography>;
    },
    header: () => "FECHA DE PEDIDO",
  }),
  columnHelper.accessor(
    (row) => ({ name: row.store.name, url: row.store.url }),
    {
      id: "store",
      sortingFn: (rowA: Row<OrderFull>, rowB: Row<OrderFull>) =>
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
  columnHelper.accessor((row) => row.status, {
    id: "status",
    sortingFn: (rowA: Row<OrderFull>, rowB: Row<OrderFull>) =>
      sortNumbers(
        orderStatusOrder[rowA.original.status],
        orderStatusOrder[rowB.original.status],
      ),
    cell: (info) => {
      const status = info.getValue();
      return (
        <Chip
          variant="outlined"
          className="w-40 justify-center"
          label={orderStatusLabel[status]}
          color={orderStatusColor[status]}
        />
      );
    },
    header: () => "ESTADO",
  }),
  columnHelper.accessor(
    (row) => ({ cost: row.productsCost, currency: row.currency.name }),
    {
      id: "productsCost",
      sortingFn: (rowA: Row<OrderFull>, rowB: Row<OrderFull>) =>
        sortNumbers(rowA.original.productsCost, rowB.original.productsCost),
      cell: (info) => {
        const price = info.getValue();
        return (
          <Typography className="text-left">{`${price.currency} ${price.cost}`}</Typography>
        );
      },
      header: () => "PRECIO",
    },
  ),
  columnHelper.accessor(
    (row) => ({
      start: row.minApproximateDeliveryDate,
      end: row.maxApproximateDeliveryDate,
    }),
    {
      id: "approximateDeliveryDate",
      sortingFn: (rowA: Row<OrderFull>, rowB: Row<OrderFull>) =>
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
  columnHelper.accessor((row) => row.review, {
    id: "review",
    size: 40,
    cell: (info) => {
      const review = info.getValue();
      return (
        <div
          className="flex items-center justify-center gap-1"
          title="Calificación"
        >
          <Typography>{review?.rating ?? "-"}</Typography>
          {review && <Icons.Star className="text-letters" />}
        </div>
      );
    },
    header: () => null,
  }),
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

const OrderTable: FC<Props> = ({ orders, hasFilters }) => {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "orderDate",
      desc: true,
    },
  ]);

  const table = useReactTable({
    data: orders ?? [],
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
    <>
      {orders && orders.length > 0 ? (
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
                      <td
                        colSpan={row.getVisibleCells().length}
                        className="p-2"
                      >
                        <div className="flex w-full flex-col pb-6 pl-10 md:flex-row">
                          <div className="flex w-full flex-col">
                            <Typography className="font-semibold">
                              {`${row.original.products.length} Producto${
                                row.original.products.length > 1 ? "s" : ""
                              }`}
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
                                          ? `${row.original.currency.name} ${r.price}`
                                          : `${row.original.currency.name} -`}
                                      </Typography>
                                    </td>
                                    <td className="pb-1">
                                      <OrderProductStatus
                                        deliveryId={r.deliveryId}
                                        isDelivered={r.delivery?.delivered}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="mt-4 flex w-full flex-col md:mt-0">
                            {row.original.orderPayments.length > 0 && (
                              <Typography className="font-semibold">
                                {`${row.original.orderPayments.length} Pago${
                                  row.original.orderPayments.length > 1
                                    ? "s"
                                    : ""
                                } Realizado${
                                  row.original.orderPayments.length > 1
                                    ? "s"
                                    : ""
                                }`}
                              </Typography>
                            )}
                            <OrderPaymentTable
                              className="w-fit"
                              currency={row.original.currency.name}
                              payments={row.original.orderPayments}
                              productsCost={row.original.productsCost}
                            />
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
      ) : (
        <div className="mt-4 text-center">
          {hasFilters ? (
            <Typography>
              ¡Oops! Parece que no hay resultados que coincidan con los filtros
              que seleccionaste.
            </Typography>
          ) : (
            <Typography>
              Aún no tienes órdenes. Puedes agregar una desde{" "}
              <Link href="/orders/new" className="link">
                aquí
              </Link>
              .
            </Typography>
          )}
        </div>
      )}
    </>
  );
};

export default OrderTable;
