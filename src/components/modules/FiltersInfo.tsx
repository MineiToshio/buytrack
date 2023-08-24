import { FC, Fragment } from "react";
import Chip from "../core/Chip";
import Typography from "../core/Typography";

type FiltersInfoProps = {
  filteredData: Record<
    string,
    | {
        order: number;
        title: string;
        value:
          | {
              label: string;
              value: string;
            }[]
          | string
          | undefined;
      }
    | undefined
  >;
  onDelete: (searchKey: string, searchValue?: string) => void;
};

const FiltersInfo: FC<FiltersInfoProps> = ({ filteredData, onDelete }) => (
  <div className="flex flex-col">
    <Typography className="mb-2 font-semibold">Filtros de búsqueda</Typography>
    <div className="flex gap-6">
      {Object.entries(filteredData)
        .sort((a, b) => (a?.[1]?.order ?? 0) - (b?.[1]?.order ?? 0))
        .map(([key, data]) => (
          <Fragment key={key}>
            {data?.value && (
              <div className="flex flex-col">
                <Typography color="muted" size="sm">
                  {data.title}
                </Typography>
                {typeof data.value === "string" ? (
                  <Chip
                    className="text-letters [text-wrap:nowrap]"
                    label={data.value}
                    onDelete={() => onDelete(key)}
                    size="xs"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {data.value.map((v) => (
                      <Chip
                        className="text-letters [text-wrap:nowrap]"
                        key={v.value}
                        label={v.label}
                        onDelete={() => onDelete(key, v.value)}
                        size="xs"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </Fragment>
        ))}
    </div>
  </div>
);

export default FiltersInfo;
