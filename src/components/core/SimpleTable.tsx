import { FC } from "react";
import Typography from "@/core/Typography";
import { cn } from "@/styles/utils";

export type SimpleTableColumns = Array<{
  title: string;
  dataAttribute: string;
  align?: "left" | "right" | "center";
  width?: number;
}>;

type SimpleTableProps = {
  columns: SimpleTableColumns;
  data: Array<{
    [attribute: string]: any;
  }>;
  showRowNumber?: boolean;
  dataKeyAttribute: string;
  className?: string;
};

const SimpleTable: FC<SimpleTableProps> = ({
  data,
  columns,
  showRowNumber,
  dataKeyAttribute,
  className,
}) => {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-md bg-slate-50 shadow-md",
        className,
      )}
    >
      <table className="w-full rounded-md">
        <thead>
          <tr className="border-b bg-slate-200">
            {showRowNumber && <th className="text-center w-7"> </th>}
            {columns.map((item) => (
              <th
                align={item.align ?? "center"}
                style={{ width: item.width }}
                key={item.title}
                className="p-2"
              >
                <Typography>{item.title.toUpperCase()}</Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((itemBody, i) => (
            <tr
              key={itemBody[dataKeyAttribute]}
              className={cn({
                "border-b": i < data.length - 1,
                "bg-slate-100": i % 2 !== 0,
              })}
            >
              {showRowNumber && (
                <td className="text-center w-7 px-2 py-1">
                  <Typography>{i + 1}</Typography>
                </td>
              )}
              {columns.map((itemHeader) => (
                <td
                  className="px-2 py-1"
                  align={itemHeader.align ?? "center"}
                  key={
                    itemBody[dataKeyAttribute] +
                    itemBody[itemHeader.dataAttribute]
                  }
                >
                  <Typography>{itemBody[itemHeader.dataAttribute]}</Typography>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTable;
