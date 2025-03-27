import React, { ReactElement, useState } from "react";

interface TooltipProps {
  disabled?: boolean;
  children: ReactElement;
  content: string;
  position?: "top" | "bottom" | "right" | "left";
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  disabled = false,
  children,
  content,
  position = "top",
  className = "",
}) => {
  const [visible, setVisible] = useState(false);

  const handleMouseEnter = () => setVisible(true);
  const handleMouseLeave = () => setVisible(false);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  if (disabled) return children;
  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Element */}
      {children}

      {/* Tooltip Content */}
      {visible && (
        <div
          role="tooltip"
          className={`text-nowrap absolute px-3 py-2 text-sm font-medium text-white bg-primary-700 rounded-lg shadow-md z-10 ${positionClasses[position]} ${className}`}
        >
          {content}
          {/* Tooltip Arrow */}
          <div
            className={`absolute w-3 h-3 bg-primary-700 rotate-45 ${
              {
                top: "-bottom-0.5 left-1/2 transform -translate-x-1/2",
                bottom: "-top-0.5 left-1/2 transform -translate-x-1/2",
                left: "-right-0.5 top-1/2 transform -translate-y-1/2",
                right: "-left-0.5 top-1/2 transform -translate-y-1/2",
              }[position]
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
