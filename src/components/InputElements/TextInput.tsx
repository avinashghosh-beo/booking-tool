import React, { useRef, useEffect } from "react";
import { Forbidden2Icon } from "../icons";

import Spinner from "../common/Spinner";

interface TextInputProps {
  errorMessages: string[];
  label?: string;
  register: Function;
  placeholder: string;
  id: string;
  required?: boolean;
  type: string;
  onChange?: Function;
  defaultValue?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  onButtonClick?: () => void;
  buttonIcon?: React.ReactNode;
  onBlur?: () => void;
  buttonLoading?: boolean;
}
const TextInput: React.FC<TextInputProps> = ({
  required,
  errorMessages,
  label,
  register = () => {},
  placeholder,
  type,
  id,
  onChange = () => {},
  defaultValue,
  showLabel = true,
  size = "md",
  onButtonClick,
  buttonIcon,
  onBlur = () => {},
  buttonLoading = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node) &&
        document.activeElement !== inputRef.current
      ) {
        onBlur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onBlur]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onButtonClick) {
      e.preventDefault();
      onButtonClick();
    }
  };

  if (type === "textarea")
    return (
      <div>
        {showLabel && (
          <label
            aria-label={label}
            htmlFor={id}
            className="block text-sm font-medium text-primary"
          >
            {label} {required ? "*" : " _"}
          </label>
        )}
        <textarea
          value={defaultValue}
          onChange={(e) => {
            onChange(e.target.value);
            return e;
          }}
          type={type}
          placeholder={placeholder}
          id={id}
          {...register()}
          className={`block w-full mt-1 transition-colors border-2 rounded-md shadow-sm border-primary-100 bg-primary-50 hover:border-primary-400 focus:border-primary-500 focus:outline-none ${
            size === "sm"
              ? "px-2 py-1"
              : size === "md"
              ? "px-3 py-2.5"
              : "px-4 py-2.5"
          }`}
        />
        {errorMessages.map(
          (item, index) =>
            !!item && (
              <div
                aria-errormessage={item}
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
  return (
    <div className="w-full">
      {showLabel && (
        <label
          aria-label={label}
          htmlFor={id}
          className="block text-sm font-medium text-primary"
        >
          {label} {required && "*"}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          onBlur={(e) => {
            if (!buttonRef.current?.contains(e.relatedTarget as Node)) {
              onBlur();
            }
          }}
          value={defaultValue}
          onChange={(e) => {
            onChange(e.target.value);
            return e;
          }}
          onKeyPress={handleKeyPress}
          type={type}
          placeholder={placeholder}
          id={id}
          {...register()}
          className={`block w-full mt-1 transition-colors border-2 rounded-md shadow-sm border-primary-100 bg-primary-50 hover:border-primary-400 focus:border-primary-500 focus:outline-none ${
            size === "sm"
              ? "px-2 py-1"
              : size === "md"
              ? "px-3 py-2.5"
              : "px-4 py-2.5"
          } ${buttonIcon ? "pr-10" : ""}`}
        />
        {buttonIcon && !buttonLoading && (
          <button
            ref={buttonRef}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onButtonClick) {
                onButtonClick();
              }
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary-100 hover:bg-primary-200 rounded-md transition-colors text-primary-600"
          >
            {buttonIcon}
          </button>
        )}
        {buttonIcon && buttonLoading && (
          <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md transition-colors text-primary-600">
            <Spinner />
          </button>
        )}
      </div>
      {errorMessages.map(
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

export default TextInput;
