import React from "react";
import Select, { StylesConfig } from "react-select";

const dummyAmenities = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

interface SelectorProps {
  name: string;
  defaultValue?: any[];
  options: { value: string; label: string }[];
  isMulti?: true;
  isSearchable?: boolean;
}

function Selector(prop: SelectorProps) {
  const colourStyles: StylesConfig<any, true> = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "transparent",
      value: "white",
      border: "1px solid #ccc",
      padding: "8px 6px 8px 6px",
      fontWeight: "500",
      borderRadius: ".5rem",
      color: "#333",
      outline: "none",
      "&:focus": {
        borderColor: "#3182ce",
        boxShadow: "none",
      },
      "&:focus-visible": {
        boxShadow: "none",
      },
      "&.dark": {
        borderColor: "#333",
        backgroundColor: "#1a202c",
        color: "#fff",
        "&:focus": {
          borderColor: "#3182ce",
        },
      },
    }),
  };
  return (
    <>
      <Select
        defaultValue={prop.defaultValue}
        isMulti={prop.isMulti}
        isSearchable={prop.isMulti || false}
        name={prop.name}
        options={prop.options}
        styles={colourStyles}
        className="basic-multi-select "
        classNamePrefix="select"
      />
    </>
  );
}

export default Selector;
