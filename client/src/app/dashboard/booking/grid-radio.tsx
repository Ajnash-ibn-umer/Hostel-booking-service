"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
export default function OptionSquareRadio(optionData: any[]) {
  const [selectedOption, setSelectedOption] = React.useState(
    optionData[0].value,
  );

  return (
    <div className="mx-auto w-full max-w-md p-4">
      <h2 className="mb-4 text-2xl font-bold">Select a Option</h2>
      <RadioGroup
        value={selectedOption}
        onValueChange={setSelectedOption}
        className="grid grid-cols-3 gap-4"
      >
        {optionData.map((option) => (
          <div key={option.value} className="relative">
            <RadioGroupItem
              value={option.value}
              id={option.value}
              className="peer sr-only"
            />
            <Label
              htmlFor={option.value}
              className={`flex w-full items-center justify-center p-4 ${option.bgOption} ${option.textOption} aspect-square cursor-pointer rounded-lg text-center font-medium transition-all duration-200 ease-in-out hover:opacity-90 peer-checked:ring-2 peer-checked:ring-primary peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 peer-focus:ring-offset-background`}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      <p className="mt-4">Selected Option: {selectedOption}</p>
    </div>
  );
}
