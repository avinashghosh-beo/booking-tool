import React from "react";
import { Forbidden2Icon } from "../icons";
import Select, { components } from "react-select";
import { COLORS } from "../../assets/theme/colors";

interface SelectInputProps {
  errorMessages: string[];
  label?: string;
  placeholder: string;
  id: string;
  required?: boolean;
  selectedValue: string;
  options: { value: string; label: string }[];
  onChange: Function;
  isMulti?: boolean;
  showLabel?: boolean;
  theme?: "regular" | "light";
  all?: boolean;
  isSearchable?: boolean;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  theme = "regular",
  showLabel = true,
  errorMessages,
  label,
  placeholder,
  id,
  required,
  selectedValue,
  options,
  onChange,
  isMulti,
  isSearchable = false,
  all = false,
}) => {
  const MultiValueContainer = ({ children, data, ...props }) => {
    const values = props.getValue();
    const displayCount = 2; // Show only 2 items
    if (all) return <div className="px-2 text-black-800">All</div>;
    if (values.length > displayCount) {
      return (
        <components.ValueContainer {...props}>
          {values.slice(0, displayCount).map((val, index) => (
            <span key={index} className="px-2 mr-1 rounded-sm bg-[#E6E6E6]">
              {val.label}
              {index < displayCount - 1 ? ", " : ""}
            </span>
          ))}
          <span className="px-2 rounded-sm bg-[#E6E6E6]">
            {" "}
            + {values.length - displayCount} more
          </span>
        </components.ValueContainer>
      );
    }
    return (
      <components.ValueContainer {...props}>
        {children}
      </components.ValueContainer>
    );
  };

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      padding: 6,
      borderColor: state.isFocused ? COLORS.primary[500] : COLORS.primary[100],
      backgroundColor: theme === "regular" ? COLORS.primary[50] : COLORS.white,
      borderRadius: "0.5rem",
      boxShadow: state.isFocused
        ? `0 0 0 0px ${COLORS.primary[500]}`
        : "0 1px 1px 0 rgba(0, 0, 0, 0.05)",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      "&:hover": {
        borderColor: COLORS.primary[400],
      },
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 9999,
      borderRadius: "0.375rem",
      border: `0 0 0 0px ${COLORS.primary[100]}`,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    }),
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? COLORS.primary[100]
        : state.isFocused
        ? COLORS.primary[50]
        : "white",
      color: COLORS.gray,
      "&:active": {
        backgroundColor: COLORS.primary[300],
      },
    }),
  };

  return (
    <div>
      {showLabel && (
        <label
          aria-label={label}
          htmlFor={id}
          className="block pb-1 text-sm font-medium text-primary"
        >
          {label} {required && "*"}
        </label>
      )} 
      <Select
        hideSelectedOptions={false}
        isSearchable={isSearchable}
        components={{ ValueContainer: MultiValueContainer }}
        placeholder={placeholder}
        isMulti={isMulti ? true : false}
        value={selectedValue}
        styles={customStyles}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        menuPlacement="auto"
        onChange={(value) => {
          if (isMulti) {
            if (value?.at(-1)?.value === "all") onChange(options);
            else onChange(value);
          } else {
            onChange(value);
          }
        }}
        options={all ? [{ label: "All", value: "all" }, ...options] : options}
      />
      {errorMessages?.map(
        (item, index) =>
          !!item && (
            <div
              key={index}
              className="flex gap-2 mt-2 text-sm text-danger-600"
            >
              <Forbidden2Icon />
              {item}
            </div>
          )
      )}
    </div>
  );
};

export default SelectInput;
