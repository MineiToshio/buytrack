import { FC } from "react";
import Typography from "./Typography";

type EmptyTableBodyProps = {
  numberOfColumns: number;
  emptyText?: string;
};

const EmptyTableBody: FC<EmptyTableBodyProps> = ({
  numberOfColumns,
  emptyText,
}) => (
  <tr className="border-b">
    <td colSpan={numberOfColumns}>
      <Typography className="text-center p-2">
        {emptyText ?? "No hay información para mostrar"}
      </Typography>
    </td>
  </tr>
);

export default EmptyTableBody;
