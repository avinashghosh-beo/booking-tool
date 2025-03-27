import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

interface AccordionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  showIcon?: boolean;
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Accordion = ({ children, className = "" }: AccordionProps) => (
  <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden mb-3 ${className}`}>
    {children}
  </div>
);

export const AccordionTitle = ({ children, className = "", isOpen = false, showIcon = true, ...props }: AccordionTitleProps) => (
  <div className={`flex items-center justify-between px-4 py-3 bg-[#E1EDFD] hover:bg-[#E1EDFD] transition-colors duration-200 ${className}`} {...props}>
    <div className="flex items-center gap-2 text-[#0C4280] font-medium">
      {children}
    </div>
    {showIcon && (
      <div className="w-6 h-6 flex items-center justify-center rounded border border-[#409BF0] bg-[#E1EDFD]">
        {isOpen ? <ChevronUp size={14} className="text-[#409BF0]" /> : <ChevronDown size={14} className="text-[#094B96]" />}
      </div>
    )}
  </div>
);

export const AccordionContent = ({ children, className = "" }: AccordionContentProps) => (
  <div className={`px-4 py-3 bg-white ${className}`}>{children}</div>
);

export default {
  Root: Accordion,
  Title: AccordionTitle,
  Content: AccordionContent,
};
