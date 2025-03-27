import React, { useMemo, useState } from "react";
import { ArrowRightIcon } from "../icons";

interface TableHeaderProps {
  columns?: [];
  columnWidths?: [];
  options: {};
  updateOptions: Function;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columns = [],
  columnWidths = [],
  options,
  updateOptions = () => {},
}) => {
  const [sortItem, setSortItem] = useState(null);
  const [sortMode, setSortMode] = useState(null);
  const sortOptions = [null, "asc", "desc"];

  const sortObject = useMemo(
    () =>
      Object.fromEntries(
        columns
          .filter(({ enableSort }) => enableSort)
          .map(({ sortKey }) => [sortKey, null])
      ),
    [columns]
  );

  function handleSortingChange(currentItem) {
    // Get next index in the cycle
    const nextIndex = (sortOptions.indexOf(sortMode) + 1) % sortOptions.length;
    const newSortMode = sortOptions[nextIndex];

    setSortItem(currentItem);
    setSortMode(newSortMode);

    updateOptions({ ...sortObject, [currentItem]: newSortMode });
  }

  
  function visiblity(index) {
    switch (index) { 
      default:
        return "block";
    }
  }

  // function visiblity(index) {
  //   switch (index) {
  //     case 0:
  //     case 1:
  //       return "block";
  //     case 2:
  //     case 3:
  //     case 4:
  //       return "hidden md:block";
  //     case 5:
  //       return "hidden lg:block";
  //     default:
  //       return "hidden xl:block";
  //   }
  // }

  return (
    <div className="flex items-center p-4 border rounded-t-lg md:justify-between bg-primary-100 border-b-primary-600 border-primary-100">
      {columns?.map((col, index) => (
        <div
          key={index}
          className={`flex font-semibold min-w-24 ${visiblity(index)}`}
          style={{ width: columnWidths[index] + "%" }}
        >
          <div className="flex w-full gap-x-4">
            <div>{col.title}</div>
            {col?.enableSort && (
              <SortingOptions
                onClick={() => handleSortingChange(col.sortKey)}
                sortMode={sortMode}
                isActive={sortItem === col?.sortKey}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const SortingOptions = ({ onClick, sortMode, isActive }) => {
  return (
    <button onClick={onClick} className="flex items-center justify-center h-6">
      {isActive ? (
        sortMode === null ? (
          <div className="text-2xl text-center">-</div>
        ) : (
          <ArrowRightIcon
            className={`${
              sortMode === "asc" ? "rotate-90" : "rotate-[270deg]"
            }`}
          />
        )
      ) : (
        <div className="text-2xl text-center">-</div>
      )}
    </button>
  );
};

export default TableHeader;
