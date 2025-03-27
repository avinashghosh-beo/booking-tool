import React, { useState, useEffect, useRef } from "react";
import { SearchNormalIcon } from "../icons";

interface SearchInputProps {
  showIcon?: boolean;
  iconPosition?: "left" | "right";
  customIcon?: React.ReactNode;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: (value: string) => void;
  fetchResults?: (query: string) => Promise<string[]>; // Function to fetch search results
  fillColor?: string;
  debounceDelay?: number; // Debounce delay in ms (default: 300ms) 
}

export const SearchInput: React.FC<SearchInputProps> = ({
  showIcon = true,
  iconPosition = "right",
  customIcon,
  placeholder = "Search...",
  onChange,
  onSearch,
  fetchResults,
  fillColor = "bg-primary-50",
  debounceDelay = 300, 
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState(searchValue);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, debounceDelay);
    return () => clearTimeout(handler);
  }, [searchValue, debounceDelay]);

  // Fetch search results when debouncedValue updates
  useEffect(() => {
    if (debouncedValue && fetchResults) {
      fetchResults(debouncedValue).then((results) => {
        setSearchResults(results);
        setShowDropdown(results.length > 0);
      });
    } else {
      setShowDropdown(false);
    }
  }, [debouncedValue, fetchResults]);

  // Hide dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  const handleResultClick = (result: string) => {
    setSearchValue(result);
    setShowDropdown(false);
    if (onSearch) onSearch(result);
  };

  return (
    <div className="relative w-full">
      {/* Search Input Box */}
      <div
        className={`flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 ${
          iconPosition === "left" ? "flex-row" : "flex-row-reverse"
        }`}
      >
        {showIcon && (
          <div
            className={`p-2 ${
              iconPosition === "left" ? "pl-4" : "pr-4"
            } text-gray-500 ${fillColor}`}
          >
            {customIcon || <SearchNormalIcon />}
          </div>
        )}
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`flex-1 p-2 focus:outline-none ${fillColor}`}
        />
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute left-0 z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg"
        >
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleResultClick(result)}
            >
              {result}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
