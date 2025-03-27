import React, { ReactElement } from "react";
import Spinner from "./Spinner";
import { ArrowRightIcon, TickCircleIcon } from "../icons";

const padding = {
  xs: "py-1 px-4",
  sm: "py-2.5 px-4",
  md: "py-3 px-4",
  lg: "py-4 px-4",
};

const buttonPadding = {
  xs: "py-1 px-1",
  sm: "py-2 px-2",
  md: "py-3 px-3",
  lg: "py-4 px-6",
  xl: "py-4 px-10",
};

interface ButtonComponentProps {
  loading?: boolean;
  title?: string | ReactElement;
  icon?: string | ReactElement;
  onClick?: Function;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  textStyle?: string;
  buttonStyle?: string;
  disabled?: boolean;
  iconPlacement?: "left" | "right" | "center";
  colorScheme:
    | "primary"
    | "secondary"
    | "default"
    | "transparent"
    | "light"
    | "warning"
    | "danger";
}

export const ButtonComponent: React.FC<ButtonComponentProps> = ({
  title,
  icon = "",
  onClick = () => {},
  size = "xs",
  textStyle = "font-medium text-md",
  buttonStyle = "",
  disabled = false,
  colorScheme = "primary",
  iconPlacement = "right",
  loading = false,
  ...props
}) => {
  const getColors = {
    primary:
      "bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 text-white",
    secondary:
      "bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 text-white",
    warning:
      "bg-warning-700 hover:bg-warning-500 focus:ring-secondary-500 text-white",
    default:
      "bg-primary-50 hover:bg-primary-100 focus:ring-primary-500 text-black-800",
    light:
      "bg-white hover:border-primary-400 focus:ring-primary-500 text-gray-500",
    danger:
      "bg-danger-600 hover:border-danger-400 focus:ring-danger-500 text-white",
    transparent: "hover:bg-primary-100 focus:ring-primary-100 text-primary",
  };

  function getContentAlignment() {
    let finalClassname = "flex items-center ";
    if (icon) {
      if (iconPlacement === "left") {
        finalClassname += "flex-row-reverse justify-between";
      } else if (iconPlacement === "right") {
        finalClassname += "justify-between";
      } else {
        finalClassname += "justify-center";
      }
    } else {
      finalClassname += "justify-center";
    }
    return finalClassname;
  }

  return (
    <button
      {...props}
      disabled={disabled || loading}
      onClick={() => onClick()}
      className={`flex items-center whitespace-nowrap disabled:bg-gray-200 disabled:cursor-not-allowed border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${textStyle} ${
        getColors[colorScheme]
      } ${buttonPadding[size]} ${buttonStyle} ${getContentAlignment()}`}
    >
      {title}
      {icon && <span className={title ? "ps-2" : ""}>{icon}</span>}
      {loading && (
        <span className="ps-2">
          <Spinner />
        </span>
      )}
    </button>
  );
};

interface SelectButtonProps {
  iconPosition?: "right" | "left";
  customIcon?: boolean | string | ReactElement;
  selected: boolean;
  onSelect: Function;
  style?: string;
  text: string;
  size?: string;
  disabled?: boolean;
}

export const SelectButton: React.FC<SelectButtonProps> = ({
  iconPosition = "right",
  customIcon = false,
  selected,
  onSelect,
  style,
  text,
  size = "sm",
  disabled = false,
}) => {
  return (
    <button
      disabled={disabled}
      className={`w-full border-2 flex disabled:cursor-not-allowed rounded-md whitespace-nowrap items-center bg-primary-50 hover:border-primary-400 ${
        iconPosition === "left" ? "flex-row-reverse" : "flex-row"
      } ${padding[size]} ${
        selected ? "border-primary-500" : "border-primary-100"
      } ${style}`}
      onClick={() => onSelect()}
    >
      {text}
      {customIcon ? (
        customIcon
      ) : (
        <div
          size={16}
          className={
            selected ? "text-primary-500 ml-2" : "text-primary-300 ml-2"
          }
        >
          <TickCircleIcon />
        </div>
      )}
    </button>
  );
};

interface LoginButtonProps {
  loading: boolean;
  onClick: Function;
  title: string;
  type?: "submit" | "reset" | "button" | undefined;
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  loading,
  onClick,
  title,
  type = "",
}) => {
  return (
    <button
      aria-label={title}
      onClick={() => onClick()}
      disabled={loading}
      className={`button w-full h-12 bg-primary-600 rounded-lg cursor-pointer select-none
                  active:translate-y-2  active:[box-shadow:0_0px_0_0_#0C4280,0_0px_0_0_#1b70f841]
                  active:border-b-[0px]
                  hover:-translate-y-[2px]  hover:[box-shadow:0_5px_0_0_#0C4280,0_12px_0_0_#1b70f841]
                  transition-all duration-150 [box-shadow:0_5px_0_0_#0C4280,0_10px_0_0_#1b70f841]
                ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
      type={type}
    >
      <div className="flex flex-row items-center justify-center h-full gap-3 text-lg text-white uppercase">
        {title}
        {loading ? <Spinner /> : <ArrowRightIcon />}
      </div>
    </button>
  );
};
