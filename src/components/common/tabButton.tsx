import React, { useEffect, useState } from "react";

interface Tab {
  key: string;
  title: string;
  icon?: React.ReactNode;
  [key: string]: any;
}

interface TabButtonsProps {
  tabs: Tab[];
  className?: string;
  showImage?: string | null;
  selectedTab?: string;
  selectedChange?: (key: string, tab: Tab) => void;
  direct?: boolean;
  showContentTab?: boolean;
}

export const TabButtons: React.FC<TabButtonsProps> = ({ tabs, className = "ordinary", showImage = null, selectedTab, selectedChange = () => {}, direct = false, showContentTab }) => {
  const [tabsTemp, setTabsTemp] = useState<Tab[]>(showContentTab ? tabs.filter((tab) => tab.title === "Elements") : tabs);

  useEffect(() => {
    setTabsTemp(showContentTab ? tabs.filter((tab) => tab.title === "Elements") : tabs);
  }, [showContentTab, tabs]);

  return (
    (tabsTemp?.length >= 1 || (tabsTemp?.length > 0 && direct)) && (
      <div className="flex  bg-[#F1F7FE] gap-2 p-2 bg-white rounded-lg shadow-sm">
        {tabsTemp?.map((tab, index) => (
          <button
            key={index}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
              ${selectedTab === tab.key ? "bg-primary text-white shadow-sm" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}
              ${className === "ordinary" ? "border border-gray-200" : ""}
            `}
            onClick={() => selectedChange(tab.key, tab)}
          >
            {showImage ? (
              <img src={`${import.meta.env.VITE_APP_CDN}${tab[showImage]}`} alt={tab.title} className="w-5 h-5 object-contain" />
            ) : tab.icon ? (
              <React.Fragment>
                {tab.icon}
                {tab.title && <span>{tab.title}</span>}
              </React.Fragment>
            ) : (
              <span>{tab.title}</span>
            )}
          </button>
        ))}
      </div>
    )
  );
};
