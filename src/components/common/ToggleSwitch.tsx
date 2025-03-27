import React from "react";

const ToggleSwitch = ({ checked, onChange, label, inverted = false, disabled = false }) => {
  return (
    <label
      className={`inline-flex items-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"} gap-x-3 ${
        inverted ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        className="absolute w-0 h-0 opacity-0 peer"
      />
      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-200 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
      {label && (
        <span className="text-sm font-medium text-gray-900">
          {label}
        </span>
      )}
    </label>
  );
};

export default ToggleSwitch;
