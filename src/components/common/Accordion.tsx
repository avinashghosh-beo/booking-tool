import React, { useState } from "react";

interface AccordionProps {
  title: string;
  content: string;
}

const Accordion: React.FC<AccordionProps> = ({ title, content, allowFullHeight = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-4 border border-gray-300 rounded-md overflow-hidden">
      {/* Accordion Header */}
      <button
        className="flex items-center justify-between w-full p-4 text-left text-gray-700 hover:bg-primary-50 focus:outline-none"
        onClick={toggleAccordion}
      >
        <span>{title}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Accordion Content */}
      <div
        className={`transition-all duration-300 ${
          isOpen ? `${allowFullHeight ? "max-h-fit" : "max-h-[500px]"} overflow-auto` : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="p-4 text-gray-600">{content}</div>
      </div>
    </div>
  );
};

export const GhostAccordion = ({ open, children }) => {
  return (
    <div className="border-white">
      {/* Accordion Content */}
      <div
        className={`transition-all duration-300 ${
          open ? "max-h-[500px] overflow-auto" : "max-h-0 overflow-hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

// Example Usage
const AccordionList: React.FC = ({ items = [], allowFullHeight = false }) => { 

  return (
    <div className="w-full">
      {items.map((item, index) => (
        <Accordion key={index} title={item.title} content={item.content} allowFullHeight={allowFullHeight} />
      ))}
    </div>
  );
};

export default AccordionList;
