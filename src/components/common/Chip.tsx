import React, { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";

interface ChipProps {
  type?: "primary" | "danger" | "warning" | "success" | "muted" | string;
  children: string | ReactElement;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  showDot?: boolean;
  onClick?: Function;
  selected?: boolean;
  loading?: boolean;
}

const Chip: React.FC<ChipProps> = ({
  loading = false,
  selected = false,
  onClick,
  type = "primary",
  size = "md",
  showDot = true,
  children,
}) => {
  const chipBgColor = {
    primary: selected
      ? "bg-primary-400"
      : "bg-primary-100 hover:bg-primary-200",
    danger: selected ? "bg-danger-500" : "bg-danger-100 hover:bg-danger-200",
    warning: selected
      ? "bg-warning-500"
      : "bg-warning-100 hover:bg-warning-200",
    success: selected
      ? "bg-success-500"
      : "bg-success-100 hover:bg-success-200",
    muted: selected ? "bg-gray-200" : "bg-gray-200 hover:bg-gray-200",
  };

  const chipBorderColor = {
    primary: selected ? "border-primary-600" : "border-primary-600",
    danger: selected ? "border-danger-600" : "border-danger-600",
    warning: selected ? "border-warning-600" : "border-warning-600",
    success: selected ? "border-success-600" : "border-success-600",
    muted: selected ? "border-gray-200" : "border-gray-200",
  };

  const chipTextColor = {
    primary: selected ? "text-white" : "text-primary-700",
    danger: selected ? "text-white" : "text-danger-700",
    warning: selected ? "text-white" : "text-warning-700",
    success: selected ? "text-white" : "text-success-700",
    muted: selected ? "text-primary-500" : "text-black",
  };

  const chipDotColor = {
    primary: selected ? "bg-primary-700" : "bg-primary-700",
    danger: selected ? "bg-danger-700" : "bg-danger-700",
    warning: selected ? "bg-warning-700" : "bg-warning-700",
    success: selected ? "bg-success-700" : "bg-success-700",
    muted: selected ? "bg-gray-200" : "bg-gray-200",
  };

  if (loading) <Skeleton />;

  return (
    <div
      onClick={() => (onClick ? onClick() : {})}
      className={`
        ${chipBgColor[type]} ${chipTextColor[type]} 
        ${chipBorderColor[type]} 
        ${onClick ? "cursor-pointer" : ""} 
        w-max flex items-center text-xs font-medium px-1.5 py-1 rounded-lg border`}
    >
      {showDot && (
        <div className={`${chipDotColor[type]} w-2 h-2 mr-2 rounded-full`} />
      )}
      {children}
    </div>
  );
};

interface PlainChipProps {
  children: string;
}
export const PlainChip: React.FC<PlainChipProps> = ({ children }) => (
  <div className="flex items-center justify-center px-2 text-sm text-white rounded bg-primary-500">
    {children}
  </div>
);

export default Chip;
