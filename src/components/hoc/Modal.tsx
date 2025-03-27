import React, { ReactElement } from "react";
import { createPortal } from "react-dom";
import { CloseCircleIcon } from "../icons";

interface ModalProps {
  isVisible: boolean;
  onClose: Function;
  children: ReactElement;
  size?: string;
}

const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  children,
  size = "md",
}) => {
  if (!isVisible) return null;

  const sizeClasses = {
    sm: "max-w-sm", // Small size
    md: "max-w-md", // Medium size
    lg: "max-w-lg", // Large size
    xl: "max-w-xl", // Extra-large size
    "2xl": "max-w-2xl", // Extra-large size
    "3xl": "max-w-3xl", // Extra-large size
    "4xl": "max-w-4xl", // Extra-large size
    "5xl": "max-w-5xl", // Extra-large size
    "6xl": "max-w-6xl", // Extra-large size
    "7xl": "max-w-7xl", // Extra-large size
    "8xl": "max-w-7xl sm:max-w-[95vw]", // Extra-large size
    full: "w-full max-w-4xl", // Full-screen size (customize as needed)
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex bg-black bg-opacity-50 sm:items-center sm:justify-center"
      onClick={() => onClose()}
    >
      <div
        className={`w-full ${sizeClasses[size]} p-6 bg-white rounded-t-lg sm:rounded-lg shadow-lg transform transition-all fixed bottom-0 sm:static sm:transform-none z-[101]`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="relative">
          <button
            className="absolute right-0 text-gray-500 top-3 hover:text-gray-700 sm:top-4 sm:right-4"
            onClick={() => onClose()}
          >
            <CloseCircleIcon />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body // Render the modal at the root level
  );
};

export default Modal;
