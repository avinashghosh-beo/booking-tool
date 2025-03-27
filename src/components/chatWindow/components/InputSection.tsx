import React from "react";
import { AttachSquareIcon, Send2Icon } from "../../icons";

const InputSection = ({ onSubmit }) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 my-4 transition-colors bg-white border-2 rounded-xl border-primary-100 hover:border-primary-200">
      <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
        <AttachSquareIcon />
      </button>
      <input
        type="text"
        placeholder="Type a message"
        className="flex-1 px-4 py-2 text-sm text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0"
      />
      <button
        onClick={onSubmit}
        className="text-primary-500 hover:text-primary-700 focus:outline-none"
      >
        <Send2Icon />
      </button>
    </div>
  );
};

export default InputSection;
