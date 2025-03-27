import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import { components } from "react-select";
import { SearchNormalIcon } from "../icons";
import { COLORS } from "../../assets/theme/colors";

interface PostalLocation {
  plz_name: string;
  lan_name: string;
  plz_code: string;
}

interface Option {
  value: string;
  label: string;
}

const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <SearchNormalIcon />
    </components.DropdownIndicator>
  );
};

const SearchBar = ({
  setSelectedValue,
  selectedValue,
  fetchRequest,
  showLabel = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const loadOptions = async (inputValue: string): Promise<Option[]> => {
    if (!inputValue) {
      setIsLoading(false);
      return [];
    }

    try {
      const res = await fetchRequest(inputValue);
      // TODO: extract this part to be passed as params
      const options = res.data.results.map((location: PostalLocation) => ({
        value: location.plz_code,
        label: `${location.plz_name} - ${location.lan_name} (${location.plz_code})`,
        plz_code: location.plz_code,
        lan_name: location.lan_name,
        plz_name: location.plz_name,
      }));
      return options;
    } catch (err) {
      console.error("Error fetching locations:", err);
      return [];
    }
  };

  return (
    <div className="w-full max-w-md min-w-64">
      {showLabel && (
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Postal Location
        </label>
      )}
      <AsyncSelect
        cacheOptions
        defaultOptions={false}
        loadOptions={loadOptions}
        value={selectedValue}
        placeholder="Type to search locations..."
        isSearchable
        isClearable
        className="text-black"
        classNamePrefix="select"
        loadingMessage={() => "Searching..."}
        noOptionsMessage={({ inputValue }) =>
          !inputValue ? "Start typing to search" : "No locations found"
        }
        onChange={(option) => {
          setSelectedValue(option);
        }}
        debounceTimeout={300}
        components={{ DropdownIndicator }}
        styles={{
          control: (base) => ({
            ...base,
            minHeight: "42px",
            padding:3,
            borderRadius: "0.375rem",
            borderColor: "#e5e7eb",
            backgroundColor: COLORS.primary[50],
            "&:hover": {
              borderColor: "#d1d5db",
            },
          }),
          menu: (base) => ({
            ...base,
            zIndex: 100,
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? "#4f46e5"
              : state.isFocused
              ? "#f3f4f6"
              : "white",
            "&:active": {
              backgroundColor: "#e5e7eb",
            },
          }),
          dropdownIndicator: (base) => ({
            ...base,
            padding: "8px",
            cursor: "text",
            ":hover": {
              color: "currentColor",
            },
          }),
          indicatorSeparator: () => ({
            display: "none",
          }),
        }}
      />
      {showLabel && selectedValue && (
        <p className="mt-2 text-sm text-gray-600">
          Selected: {selectedValue.label}
        </p>
      )}
    </div>
  );
};

export default SearchBar;
