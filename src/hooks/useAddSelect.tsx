import { type Option } from "@/core/Select";
import { get, post } from "@/helpers/request";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

type DataType = {
  id: string;
  name: string;
};

function useSelect<T extends DataType>(
  getUrl: string,
  postUrl: string,
  queryKey: string[]
) {
  const [options, setOptions] = useState<Option[]>([]);

  const { data, isLoading, error } = useQuery(queryKey, () => get<T[]>(getUrl));

  useEffect(() => {
    if (data) {
      const formattedData = data.map((c) => ({
        value: c.id,
        label: c.name,
      }));
      setOptions(formattedData);
    }
  }, [data]);

  const addNewOption = async (name: string) => {
    const newOption = await post<T>(postUrl, {
      name,
    });
    if (newOption) {
      setOptions((o) => [
        {
          value: newOption.id,
          label: newOption.name,
        },
        ...o,
      ]);
    }
  };

  return {
    options,
    isLoading,
    error,
    addNewOption,
  };
}

export default useSelect;
