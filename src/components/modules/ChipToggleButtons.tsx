import { FC } from "react";
import Chip from "../core/Chip";

export type Option = {
  label: string;
  value: string;
};

type ChipToggleButtonsProps = {
  options: Option[];
  value: string[] | undefined;
  onChange: (value: string[] | undefined) => void;
};

const ChipToggleButtons: FC<ChipToggleButtonsProps> = ({
  options,
  value,
  onChange,
}) => {
  const handleClick = (selectedValue: string) => {
    const isSelected = value?.includes(selectedValue);
    if (isSelected) {
      const newValue = value?.filter((v) => v !== selectedValue);
      onChange(newValue);
    } else {
      const newValue = [...(value ?? []), selectedValue];
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => handleClick(o.value)}
          type="button"
        >
          <Chip
            label={o.label}
            color={value?.includes(o.value) ? "secondary" : "muted"}
          />
        </button>
      ))}
    </div>
  );
};

export default ChipToggleButtons;
