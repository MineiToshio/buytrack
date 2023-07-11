import { type Option } from "@/core/Select";
import { get, post } from "@/helpers/request";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

type DataType = {
  id: string;
  name: string;
};

const useSelect = <T extends DataType>(
  queryKey: string[],
  getUrl: string,
  postUrl?: string,
) => {
  const [options, setOptions] = useState<Option[]>([]);

  const { data, isLoading, error } = useQuery(
    queryKey,
    () => get<T[]>(getUrl),
    { enabled: false },
  );

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
    if (postUrl) {
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
    }
  };

  return {
    options,
    isLoading,
    error,
    addNewOption,
  };
};

export default useSelect;
