"use client";

import Button from "@/core/Button";
import Chip from "@/core/Chip";
import Icons from "@/core/Icons";
import Typography from "@/core/Typography";
import ConfirmModal from "@/modules/ConfirmModal";
import SortArrow from "@/modules/SortArrow";
import { DELETE_DELIVERY } from "@/helpers/apiUrls";
import { deliveryStatus, deliveryStatusData } from "@/helpers/constants";
import { del } from "@/helpers/request";
import { formatDate } from "@/helpers/utils";
import { cn } from "@/styles/utils";
import { DeliveryFull } from "@/types/prisma";
import { QueryObserverResult, useMutation } from "@tanstack/react-query";
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
import {
  Fragment,
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";
import { sortBooleans, sortDates, sortNumbers, sortText } from "@/helpers/sort";

type Props = {
  deliveries?: DeliveryFull[];
  hasFilters: boolean;
  refetch: () => Promise<QueryObserverResult<DeliveryFull[] | undefined>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

const deleteDelivery = (deliveryId: string) =>
  del(`${DELETE_DELIVERY}${deliveryId}`);

const columnHelper = createColumnHelper<DeliveryFull>();

const DeliveryTable: FC<Props> = ({
  deliveries,
  hasFilters,
  refetch,
  setIsLoading,
}) => {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "store",
      desc: true,
    },
  ]);
  const [isDeleteMessageShowing, setIsDeleteMessageShowing] =
    useState<boolean>(false);
  const [deleteDeliveryId, setDeleteDeliveryId] = useState<string | null>(null);

  const { mutate } = useMutation({
    mutationFn: (deliveryId: string) => deleteDelivery(deliveryId),
    onSuccess: async () => {
      await refetch();
      setIsLoading(false);
    },
  });

  const toggleDeleteMessage = () => setIsDeleteMessageShowing((s) => !s);

  const showDeleteMessage = useCallback((deliveryId: string) => {
    toggleDeleteMessage();
    setDeleteDeliveryId(deliveryId);
  }, []);

  const columns = useMemo(
    () => [
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
      columnHelper.accessor((row) => row.delivered, {
        id: "delivered",
        sortingFn: (rowA: Row<DeliveryFull>, rowB: Row<DeliveryFull>) =>
          sortBooleans(rowA.original.delivered, rowB.original.delivered),
        cell: (info) => {
          const delivered = info.getValue();
          return (
            <div className="flex w-full">
              <Chip
                variant="outlined"
                className="w-28 justify-center"
                label={
                  deliveryStatusData[
                    delivered
                      ? deliveryStatus.delivered
                      : deliveryStatus.inRoute
                  ].label
                }
                color={
                  deliveryStatusData[
                    delivered
                      ? deliveryStatus.delivered
                      : deliveryStatus.inRoute
                  ].color
                }
              />
            </div>
          );
        },
        header: () => "ESTADO",
      }),
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
      columnHelper.accessor((row) => row.currier, {
        id: "currier",
        sortingFn: (rowA: Row<DeliveryFull>, rowB: Row<DeliveryFull>) =>
          sortText(rowA.original.currier, rowB.original.currier),
        cell: (info) => {
          const currier = info.getValue();
          return (
            <Typography>
              {currier != null && currier.length > 0 ? currier : "-"}
            </Typography>
          );
        },
        header: () => "COURIER",
      }),
      columnHelper.accessor(
        (row) => ({ cost: row.price, currency: row.currency.name }),
        {
          id: "price",
          sortingFn: (rowA: Row<DeliveryFull>, rowB: Row<DeliveryFull>) =>
            sortNumbers(rowA.original.price, rowB.original.price),
          cell: (info) => {
            const price = info.getValue();
            return <Typography>{`${price.currency} ${price.cost}`}</Typography>;
          },
          header: () => "PRECIO",
        },
      ),
      columnHelper.accessor((row) => row.id, {
        id: "deliveryUrl",
        size: 84,
        cell: (info) => {
          const deliveryId = info.getValue();
          return (
            <div className="flex w-full gap-5">
              <Link
                href={`/deliveries/${deliveryId}`}
                className="text-letters hover:text-gray-500"
                title="Ver más"
              >
                <Icons.View />
              </Link>
              <Button
                variant="icon"
                className="text-letters hover:text-gray-500"
                onClick={() => showDeleteMessage(deliveryId)}
                title="Eliminar"
              >
                <Icons.Delete />
              </Button>
            </div>
          );
        },
        header: () => null,
      }),
    ],
    [showDeleteMessage],
  );

  const table = useReactTable({
    data: deliveries ?? [],
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

  const confirmDelete = () => {
    if (deleteDeliveryId) {
      setIsLoading(true);
      toggleDeleteMessage();
      mutate(deleteDeliveryId);
    }
  };

  return (
    <>
      <ConfirmModal
        open={isDeleteMessageShowing}
        message="¿Estás seguro de eliminar la entrega? Esta acción es permanente."
        onCancel={toggleDeleteMessage}
        onConfirm={confirmDelete}
      />
      {deliveries && deliveries.length > 0 ? (
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
                              {`${row.original.orderProducts.length} Producto${
                                row.original.orderProducts.length > 1 ? "s" : ""
                              }`}
                            </Typography>
                            <table className="w-fit table-auto">
                              <tbody>
                                {row.original.orderProducts.map((r, i) => (
                                  <tr key={r.id}>
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
              Aún no tienes entregas programadas. Puedes agregar una desde{" "}
              <Link href="/deliveries/new" className="link">
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

export default DeliveryTable;
