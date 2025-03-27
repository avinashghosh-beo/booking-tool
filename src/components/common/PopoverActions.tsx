import React, { useState, useRef, useEffect, ReactElement } from "react";

interface PopoverProps {
  arrowHidden?: boolean;
  title?: string | ReactElement;
  content: ReactElement;
  placement?: string;
  children: ReactElement;
  containerStyle?: string;
  mode?: "select" | "hover";
  footer?: string | ReactElement;
  wrapperClassName?: string;
}

// FIXME:
const Popover: React.FC<PopoverProps> = ({
  arrowHidden = false,
  title,
  content,
  placement = "bottom",
  children,
  containerStyle = "w-64",
  mode = "select",
  footer,
  wrapperClassName,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    if (mode === "hover") setIsVisible(true);
  };

  const handleMouseLeave = () => {
    if (mode === "hover") setIsVisible(false);
  };

  const popoverRef = useRef(null);

  const togglePopover = () => setIsVisible((prev) => !prev);

  const handleClickOutside = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const popoverClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
    topLeft: "bottom-full left-0 mb-2",
    topRight: "bottom-full right-0 mb-2",
    bottomLeft: "top-full left-0 mt-2",
    bottomRight: "top-full right-0 mt-2",
    rightTop: "left-full top-0 ml-2",
    rightBottom: "left-full bottom-0 ml-2",
    leftTop: "right-full top-0 mr-2",
    leftBottom: "right-full bottom-0 mr-2",
  };

  const pointerShadow = {
    top: "border-b border-r",
    bottom: "border-t border-l",
    left: "border-r border-t",
    right: "border-l border-b",
    topLeft: "border-b border-r",
    topRight: "border-b border-r",
    bottomLeft: "border-t border-l",
    bottomRight: "border-t border-l",
    rightTop: "border-l border-b",
    rightBottom: "border-l border-b",
    leftTop: "border-r border-t",
    leftBottom: "border-r border-t",
  };

  const arrowClasses = {
    top: "bottom-[-8px] left-1/2 transform -translate-x-1/2",
    bottom: "top-[-8px] left-1/2 transform -translate-x-1/2",
    left: "right-[-8px] top-1/2 transform -translate-y-1/2",
    right: "left-[-8px] top-1/2 transform -translate-y-1/2",
    topLeft: "bottom-[-8px] left-2",
    topRight: "bottom-[-8px] right-2",
    bottomLeft: "top-[-8px] left-2",
    bottomRight: "top-[-8px] right-2",
    rightTop: "left-[-8px] top-2",
    rightBottom: "left-[-8px] bottom-2",
    leftTop: "right-[-8px] top-2",
    leftBottom: "right-[-8px] bottom-2",
  };

  return (
    <div className={`relative inline-block ${wrapperClassName}`}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={togglePopover}
        className=""
      >
        {children}
      </div>

      {/* Popover */}
      {isVisible && (
        <div
          // onClick={() => (mode === "select" ? togglePopover() : {})}
          ref={popoverRef}
          role="tooltip"
          className={`absolute z-50 ${containerStyle} text-sm bg-white border border-gray-200 rounded-lg shadow-lg text-primary-500 ${popoverClasses[placement]}`}
        >
          <div className="p-3 font-semibold bg-white rounded-lg border-primary-200 text-primary">
            {title && title}
            <div className="h-2" />
            {content}
            {footer && footer}
          </div>

          {/* Arrow */}
          {!arrowHidden && (
            <div
              className={`absolute w-4 h-4 bg-white ${pointerShadow[placement]} border-gray-200 rotate-45 ${arrowClasses[placement]}`}
            ></div>
          )}
        </div>
      )}
    </div>
  );
};

export default Popover;
