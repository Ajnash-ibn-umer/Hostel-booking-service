"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface SelectOptions {
  value: string;
  label: string;
}

export default function MultiSelect({
  values,
  placeholder = "Select options...",
  emptyMessage = "No options found.",
  selectedValues = [],
  onChange,
}: {
  values: SelectOptions[];
  placeholder?: string;
  emptyMessage?: string;
  selectedValues: string[];
  onChange?: any;
}) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<typeof values>([]);

  React.useEffect(() => {
    const initialSelected = values?.filter((option) =>
      selectedValues.includes(option.value),
    );
    setSelected(initialSelected);
  }, [values, selectedValues]);
  
  const handleSelect = (val: (typeof values)[number]) => {
    setSelected((prev) => {
      if (prev.some((item) => item && item.value === val.value)) {
        return prev.filter((item) => item && item.value !== val.value);
      } else {
        return [...prev, val];
      }
    });
    // if (selectedValues.some((item) => item && item === val.value)) {
    //   selectedValues = selectedValues.filter(
    //     (item) => item && item !== val.value,
    //   );
    // } else {
    //   selectedValues.push(val.value);
    // }

    onChange(
      selectedValues &&
        selectedValues.some((item: string) => item === val.value)
        ? selectedValues.filter((item: string) => item !== val.value)
        : [...(selectedValues || []), val.value],
    );
    console.log({ selectedValues });
  };

  const handleRemove = (val: (typeof values)[number]) => {
    setSelected((prev) => prev.filter((item) => item.value !== val.value));
    // const rem = selectedValues.filter((d) => d !== val.value);
    // console.log({ selectedValues });
    onChange(selectedValues.filter((item: any) => item !== val.value));

    console.log({ selectedValues });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-fit justify-between"
        >
          {selected && selected.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selected &&
                selected.map((val) => (
                  <Badge key={val.value} variant="secondary" className="mr-1">
                    {val.label}
                    <button
                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRemove(val);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleRemove(val)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))}
            </div>
          ) : (
            "Select values..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search options..." />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {/* <CommandItem>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    true ? "opacity-100" : "opacity-0",
                  )}
                />
                Option I
              </CommandItem> */}

              {values &&
                values.length > 0 &&
                values.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(option)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected?.some((item) => item.value === option.value)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
