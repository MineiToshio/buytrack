import Chip from "@/components/core/Chip";
import Icons from "@/components/core/Icons";
import Typography from "@/components/core/Typography";
import SortArrow from "@/components/modules/SortArrow";
import { storeTypeLabel } from "@/helpers/constants";
import { facebookRegex, instagramRegex } from "@/helpers/regex";
import { sortText } from "@/helpers/sort";
import { cn } from "@/styles/utils";
import { StoreFull } from "@/types/prisma";
import {
  Row,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { FC, Fragment, useState } from "react";

type StoreTableProps = {
  stores?: StoreFull[];
  hasFilters: boolean;
};

const columnHelper = createColumnHelper<StoreFull>();

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
  columnHelper.accessor((row) => row.name, {
    id: "name",
    sortingFn: (rowA: Row<StoreFull>, rowB: Row<StoreFull>) =>
      sortText(rowA.original.name, rowB.original.name),
    cell: (info) => {
      const date = info.getValue();
      return <Typography>{info.getValue()}</Typography>;
    },
    header: () => "NOMBRE",
  }),
  columnHelper.accessor((row) => row.productTypes, {
    id: "productTypes",
    enableSorting: false,
    cell: (info) => {
      const productTypes = info.getValue();
      return (
        <div className="flex flex-wrap gap-2">
          {productTypes?.map(({ productType: p }) => (
            <Chip
              key={p.id}
              label={p.name}
              size="xs"
              color="secondary"
              title="Tipo de producto"
            />
          ))}
        </div>
      );
    },
    header: () => "PRODUCTOS",
  }),
  columnHelper.accessor((row) => row.productsCountry, {
    id: "productsCountry",
    enableSorting: false,
    cell: (info) => {
      const productsCountry = info.getValue();
      return (
        <div className="flex flex-wrap gap-2">
          {productsCountry && productsCountry.length > 0 ? (
            productsCountry.map(({ country: c }) => (
              <Chip
                key={c.id}
                label={c.name}
                size="xs"
                color="secondary-alt"
                title="País de importación"
              />
            ))
          ) : (
            <Typography>-</Typography>
          )}
        </div>
      );
    },
    header: () => "PAÍSES DE IMPORTACIÓN",
  }),
  columnHelper.accessor((row) => row.rating, {
    id: "rating",
    size: 40,
    cell: (info) => {
      const rating = info.getValue();
      return (
        <div
          className="flex items-center justify-center gap-1"
          title={`${rating} de calificación`}
        >
          <Typography>{rating ?? "-"}</Typography>
          {rating && <Icons.Star className="text-letters" />}
        </div>
      );
    },
    header: () => null,
  }),
  columnHelper.accessor((row) => row.url, {
    id: "storeUrl",
    size: 40,
    cell: (info) => (
      <div className="flex w-full justify-center">
        <Link
          href={`/stores/${info.getValue()}`}
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

type DetailRowProps = {
  Icon: LucideIcon;
  title: string;
  children: React.ReactNode;
};

const DetailRow: FC<DetailRowProps> = ({ Icon, title, children }) => (
  <tr>
    <td className="pb-1">
      <div className="mr-4 flex items-center gap-2">
        <Icon className="text-muted" />
        <Typography
          color="muted"
          className="block truncate"
          as="span"
          title={title}
        >
          {title}
        </Typography>
      </div>
    </td>
    <td className="pb-1">{children}</td>
  </tr>
);

const StoreTable: FC<StoreTableProps> = ({ stores, hasFilters }) => {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "name",
      desc: false,
    },
  ]);

  const table = useReactTable({
    data: stores ?? [],
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
      {stores && stores.length > 0 ? (
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
              {table.getRowModel().rows.map((row, i) => {
                const facebookUser =
                  row.original.facebook?.match(facebookRegex)?.[1];
                const instagramUser =
                  row.original.instagram?.match(instagramRegex)?.[1];
                return (
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
                          <div className="w-full pb-6 pl-10">
                            <table>
                              <tbody>
                                <DetailRow
                                  Icon={Icons.ChevronSquareDown}
                                  title="Tipo"
                                >
                                  <Typography>
                                    {storeTypeLabel[row.original.type]}
                                  </Typography>
                                </DetailRow>
                                <DetailRow Icon={Icons.Globe} title="País">
                                  <Typography>
                                    {row.original.country.name}
                                  </Typography>
                                </DetailRow>
                                {row.original.whatsapp && (
                                  <DetailRow
                                    Icon={Icons.Message}
                                    title="Whatsapp"
                                  >
                                    <Link
                                      href={`https://wa.me/${row.original.whatsapp}`}
                                      target="_blank"
                                      className="hover:underline"
                                    >
                                      {row.original.whatsapp}
                                    </Link>
                                  </DetailRow>
                                )}
                                {facebookUser && (
                                  <DetailRow
                                    Icon={Icons.Facebook}
                                    title="Facebook"
                                  >
                                    <Link
                                      href={`https://facebook.com/${facebookUser}`}
                                      target="_blank"
                                      className="hover:underline"
                                    >
                                      @{facebookUser}
                                    </Link>
                                  </DetailRow>
                                )}
                                {instagramUser && (
                                  <DetailRow
                                    Icon={Icons.Instagram}
                                    title="Instagram"
                                  >
                                    <Link
                                      href={`https://instagram.com/${instagramUser}`}
                                      target="_blank"
                                      className="hover:underline"
                                    >
                                      @{instagramUser}
                                    </Link>
                                  </DetailRow>
                                )}
                                {row.original.website && (
                                  <DetailRow Icon={Icons.Web} title="Website">
                                    <Link
                                      href={row.original.website}
                                      target="_blank"
                                      className="hover:underline"
                                    >
                                      {row.original.website}
                                    </Link>
                                  </DetailRow>
                                )}
                                {row.original.hasStock && (
                                  <DetailRow
                                    Icon={Icons.Check}
                                    title="Tiene Stock"
                                  >
                                    {row.original.hasStock ? "Si" : "No"}
                                  </DetailRow>
                                )}
                                {row.original.receiveOrders && (
                                  <DetailRow
                                    Icon={Icons.Check}
                                    title="Recibe Órdenes"
                                  >
                                    {row.original.receiveOrders ? "Si" : "No"}
                                  </DetailRow>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
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
              Aún no hay tiendas. Puedes agregar una desde{" "}
              <Link
                href="/stores/new"
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

export default StoreTable;
