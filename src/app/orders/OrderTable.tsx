"use client";

import Chip from "@/components/core/Chip";
import Icons from "@/components/core/Icons";
import Typography from "@/components/core/Typography";
import { orderStatusColor, orderStatusLabel } from "@/helpers/constants";
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
import OrderPaymentTable from "./OrderPaymentsTable";
import ProductStatusDot from "./ProductStatusDot";

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
    cell: (info) => {
      const date = info.getValue();
      return <Typography>{date != null ? formatDate(date) : "-"}</Typography>;
    },
    header: () => (
      <Typography className="text-left">FECHA DE PEDIDO</Typography>
    ),
  }),
  columnHelper.accessor(
    (row) => ({ name: row.store.name, url: row.store.url }),
    {
      id: "store",
      cell: (info) => {
        const store = info.getValue();
        return (
          <Link href={`/stores/${store.url}`}>
            <Typography>{store.name}</Typography>
          </Link>
        );
      },
      header: () => <Typography className="text-left">TIENDA</Typography>,
    },
  ),
  columnHelper.accessor((row) => row.status, {
    id: "status",
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
    header: () => <Typography className="text-left">ESTADO</Typography>,
  }),
  columnHelper.accessor(
    (row) => ({ cost: row.productsCost, currency: row.currency.name }),
    {
      id: "price",
      cell: (info) => {
        const price = info.getValue();
        return (
          <Typography className="text-left">{`${price.currency} ${price.cost}`}</Typography>
        );
      },
      header: () => <Typography className="text-left">PRECIO</Typography>,
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
            <Typography>{`${formatDate(date.start)} - ${formatDate(
              date.end,
            )}`}</Typography>
          );
        else {
          return <Typography>-</Typography>;
        }
      },
      header: () => (
        <Typography className="text-left">ENTREGA APROX.</Typography>
      ),
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

const OrderTable: FC<Props> = ({ orders, hasFilters }) => {
  const table = useReactTable({
    data: orders ?? [],
    columns,
    defaultColumn: {
      minSize: 0,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
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
                                {row.original.products.map((r, i) => (
                                  <tr key={r.id}>
                                    <td className="pr-2">
                                      <ProductStatusDot
                                        deliveryId={r.deliveryId}
                                        isDelivered={r.delivery?.delivered}
                                      />
                                    </td>
                                    <td className="pr-5">
                                      <Typography>{r.productName}</Typography>
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
                          <div className="mt-4 flex w-full flex-col md:mt-0">
                            <Typography className="font-semibold">
                              {`${row.original.products.length} Pago${
                                row.original.products.length > 1 ? "s" : ""
                              } Realizado${
                                row.original.products.length > 1 ? "s" : ""
                              }`}
                            </Typography>
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
              No se encontraron resultados con los filtros seleccionados.
            </Typography>
          ) : (
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
          )}
        </div>
      )}
    </>
  );
};

export default OrderTable;
