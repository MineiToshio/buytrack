"use client";

import Button from "@/components/core/Button";
import Chip from "@/components/core/Chip";
import Icons from "@/components/core/Icons";
import Typography from "@/components/core/Typography";
import ConfirmModal from "@/components/modules/ConfirmModal";
import { DELETE_DELIVERY } from "@/helpers/apiUrls";
import { deliveryStatusData } from "@/helpers/constants";
import { del } from "@/helpers/request";
import { formatDate } from "@/helpers/utils";
import { cn } from "@/styles/utils";
import { DeliveryFull } from "@/types/prisma";
import { useMutation } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import {
  type Dispatch,
  FC,
  Fragment,
  type SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

type Props = {
  deliveries?: DeliveryFull[];
  onChange: Dispatch<SetStateAction<DeliveryFull[] | undefined>>;
  hasFilters: boolean;
};

const deleteDelivery = (deliveryId: string) =>
  del(`${DELETE_DELIVERY}${deliveryId}`);

const columnHelper = createColumnHelper<DeliveryFull>();

const DeliveryTable: FC<Props> = ({ deliveries, onChange, hasFilters }) => {
  const [isDeleteMessageShowing, setIsDeleteMessageShowing] =
    useState<boolean>(false);
  const [deleteDeliveryId, setDeleteDeliveryId] = useState<string | null>(null);

  const { mutate } = useMutation({
    mutationFn: (deliveryId: string) => deleteDelivery(deliveryId),
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
              {row.getIsExpanded() ? (
                <Icons.ChevronDown />
              ) : (
                <Icons.ChevronRight />
              )}
            </button>
          </div>
        ),
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
      columnHelper.accessor((row) => row.delivered, {
        id: "delivered",
        size: 150,
        cell: (info) => {
          const delivered = info.getValue();
          return (
            <div className="flex w-full justify-center">
              <Chip
                label={deliveryStatusData[delivered ? "1" : "2"].label}
                color={deliveryStatusData[delivered ? "1" : "2"].color}
              />
            </div>
          );
        },
        header: () => <Typography>Estado</Typography>,
      }),
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
          header: () => <Typography>Entrega aprox.</Typography>,
        },
      ),
      columnHelper.accessor((row) => row.currier, {
        id: "currier",
        size: 100,
        cell: (info) => {
          const currier = info.getValue();
          return (
            <Typography className="text-center">
              {currier != null && currier.length > 0 ? currier : "-"}
            </Typography>
          );
        },
        header: () => <Typography>Currier</Typography>,
      }),
      columnHelper.accessor(
        (row) => ({ cost: row.price, currency: row.currency.name }),
        {
          id: "price",
          size: 100,
          cell: (info) => {
            const price = info.getValue();
            return (
              <Typography className="text-center">{`${price.currency} ${price.cost}`}</Typography>
            );
          },
          header: () => <Typography>Precio</Typography>,
        },
      ),
      columnHelper.accessor((row) => row.id, {
        id: "deliveryUrl",
        size: 24,
        cell: (info) => {
          const deliveryId = info.getValue();
          return (
            <div className="flex w-full justify-center">
              <Link
                href={`/deliveries/${deliveryId}`}
                className="hover:text-gray-500"
              >
                <Icons.View />
              </Link>
              <Button
                variant="icon"
                className="ml-2 text-black hover:text-gray-500"
                onClick={() => showDeleteMessage(deliveryId)}
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
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
  });

  const confirmDelete = () => {
    if (deleteDeliveryId) {
      toggleDeleteMessage();
      mutate(deleteDeliveryId);
      onChange((delivery) =>
        delivery?.filter((d) => d.id !== deleteDeliveryId),
      );
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
                        <div className="flex w-full flex-col md:flex-row">
                          <div className="flex w-full flex-col">
                            <Typography className="font-bold">
                              Productos
                            </Typography>
                            <table className="w-fit table-auto">
                              <tbody>
                                {row.original.orderProducts.map((r, i) => (
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
              No se encontraron resultados con los filtros seleccionados.
            </Typography>
          ) : (
            <Typography>
              Aún no tienes entregas programadas. Puedes agregar una desde{" "}
              <Link
                href="/deliveries/new"
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

export default DeliveryTable;
