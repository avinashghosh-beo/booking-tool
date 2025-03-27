import React from "react";

import Popover from "./PopoverActions.tsx";
import ListView from "./ListView";
import Tooltip from "./ToolTip";
import Skeleton from "react-loading-skeleton";

interface AvatarGroupProps {
  data: { icon: string; title: string; onClick: Function }[];
  visibleItemsCount: number;
  expandedViewMode: "popover" | "block";
  loading?: boolean;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  data,
  visibleItemsCount,
  expandedViewMode,
  loading,
}) => {
  const extraItemsCount =
    data?.length > visibleItemsCount ? data.length - visibleItemsCount : 0;

  if (loading)
    return (
      <div>
        <div className="w-20 h-8 p-0">
          <Skeleton className="h-full" />
        </div>
      </div>
    );

  if (expandedViewMode === "popover")
    return (
      <div>
        <div className="flex -space-x-1">
          {data.slice(0, visibleItemsCount).map((item, index) => (
            <Tooltip
              key={index}
              disabled={false}
              content={item?.title}
              position="bottom"
            >
              <div className="grid bg-white border-2 rounded-full size-7 place-items-center border-primary-200">
                {item?.icon}
              </div>
            </Tooltip>
          ))}
          {extraItemsCount > 0 && (
            <Popover
              mode="select"
              title="Portals"
              content={
                <ListView
                  style="max-h-50 overflow-hidden overflow-y-auto"
                  items={data}
                />
              }
              placement="bottom"
            >
              <div className="grid text-xs bg-white border-2 rounded-full cursor-pointer size-7 place-items-center border-primary-200">
                +{extraItemsCount}
              </div>
            </Popover>
          )}
        </div>
      </div>
    );

  return (
    <div>
      <div className="flex -space-x-1">
        {data.slice(0, visibleItemsCount).map((item, index) => (
          <div
            key={index}
            className="grid bg-white border-2 rounded-full size-7 place-items-center border-primary-200"
          >
            <img className="w-3" src={item?.icon} alt="Jobware" />
          </div>
        ))}
        {extraItemsCount > 0 && (
          <div className="grid text-xs bg-white border-2 rounded-full cursor-pointer size-7 place-items-center border-primary-200">
            +{extraItemsCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarGroup;
