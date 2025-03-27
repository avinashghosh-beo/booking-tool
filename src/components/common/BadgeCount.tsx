import React, { ReactElement } from "react";

interface BadgeCountProps {
  children: ReactElement;
  count: number | string;
}

const BadgeCount: React.FC<BadgeCountProps> = ({ count, children }) => {
  return (
    <div className="relative inline-flex items-center text-sm font-medium text-center hover:bg-primary-100">
      {children}
      <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white border-2 border-white rounded-full bg-danger-500 -top-2 -end-6">
        {count}
      </div>
    </div>
  );
};

export default BadgeCount;

interface InlineCountProps {
  count: number;
}

export const InlineCount: React.FC<InlineCountProps> = ({ count }) => {
  return (
    <div className="flex items-center justify-center px-2 text-sm text-white rounded bg-primary-500">
      {count}
    </div>
  );
};
