import React, { ReactElement, useLayoutEffect, useState } from "react";
import { Maximize4Icon, MoreCircleIcon } from "../../components/icons";

interface Tab {
  id: number;
  title?: string;
  icon?: ReactElement;
  component?: JSX.Element;
}

interface TabViewProps {
  mode?: "regular" | "buttons";
  align?: "center";
  showOptions?: boolean;
  extrasLeft?: ReactElement;
  extras?: ReactElement;
  tabs: Tab[]; // Array of tabs to render
  containerStyles?: string; // Custom styles for the container
  onTabChange: Function;
  initialTabIndex?: number;
}

const TabView: React.FC<TabViewProps> = ({ showOptions = false, tabs, containerStyles, mode = "regular", align = "center", extrasLeft = <></>, extras = <></>, onTabChange = () => {}, initialTabIndex = 0 }) => {
  const [activeTab, setActiveTab] = useState(0);

  useLayoutEffect(() => {
    setActiveTab(initialTabIndex);
  }, [initialTabIndex]);

  if (mode === "buttons")
    return (
      <div className="flex flex-col h-full gap-4 bg-white rounded-lg w-94">
        {/* Tab Headers */}
        <div className="flex gap-x-4">
          {extrasLeft}
          <div className="flex items-center justify-center flex-grow gap-4 px-4 py-3 rounded-lg bg-primary-50">
            {tabs.map((tab, index) => (
              <div key={index}>
                <button
                  onClick={() => {
                    onTabChange(index);
                    setActiveTab(index);
                  }}
                  className={`px-4 py-1 text-center flex justify-between border rounded-lg grow ${activeTab !== index ? "border-primary-100 bg-primary-50" : "bg-white border-primary-400"}`}
                >
                  {tab?.title}
                  {tab?.icon}
                </button>
              </div>
            ))}
            {showOptions && (
              <div className="text-primary-700">
                <MoreCircleIcon className="" />
              </div>
            )}
          </div>
          {extras}
        </div>

        {/* Tab Content */}
        <div className="grid grow bg-primary-100/25 place-items-center rounded-xl">{tabs[activeTab].component}</div>
      </div>
    );

  return (
    <div className={`tabs-container ${containerStyles}`}>
      {/* Tab Headers */}
      <div className="flex border-b tab-headers">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => {
              onTabChange(index);
              setActiveTab(index);
            }}
            className={`px-4 py-2 ${activeTab === index ? "border-b-2 border-primary-500 text-primary-500" : "text-gray-500 hover:text-primary-500"}`}
          >
            {tab.title}
          </button>
        ))}
        {extras && <div className="flex flex-row items-center justify-end flex-grow">{extras}</div>}
      </div>

      {/* Tab Content */}
      <div className="p-4 tab-content">{tabs[activeTab].component}</div>
    </div>
  );
};

export default TabView;
