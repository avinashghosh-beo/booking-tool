import React, { useState } from "react";
import { GhostAccordion } from "../common/Accordion";
import Skeleton from "react-loading-skeleton";

// Function to get nested values based on dot notation
const getNestedValue = (obj, key) => {
  return key.split(".").reduce((acc, part) => acc && acc[part], obj);
};

const TableRow = ({
  isLoading,
  collapsible,
  renderCollapsible,
  data,
  columns,
  columnWidths,
}) => {
  function renderCell(columnInfo, rowData) {
    let renderMethod = columnInfo?.render;
    if (renderMethod && typeof renderMethod === "function") {
      return renderMethod(getNestedValue(rowData, columnInfo.key), rowData);
    } else {
      return getNestedValue(rowData, columnInfo.key);
    }
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

  const [collapsedIndex, setCollapsedIndex] = useState(null);

  return (
    <>
      <div className="bg-white border divide-y divide-gray-200 rounded-b-lg border-primary-100">
        {isLoading ? (
          <>
            <div className="p-4">
              <Skeleton height={48} />
            </div>
            <div className="p-4">
              <Skeleton height={48} />
            </div>
            <div className="p-4">
              <Skeleton height={48} />
            </div>
            <div className="p-4">
              <Skeleton height={48} />
            </div>
          </>
        ) : (
          data.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <div
                key={rowIndex}
                className="flex items-center p-4 font-medium transition-colors border-b md:justify-between hover:bg-primary-50 border-primary-50 text-primary"
              >
                {columns.map((col, colIndex) => (
                  <div
                    onClick={() =>
                      col?.disableCollapse
                        ? null
                        : collapsedIndex === rowIndex
                        ? setCollapsedIndex(null)
                        : setCollapsedIndex(rowIndex)
                    }
                    key={colIndex}
                    className={`min-w-24 px-2 ${visiblity(colIndex)}`}
                    style={{ width: columnWidths[colIndex] + "%" }}
                  >
                    {renderCell(col, row)}
                  </div>
                ))}
              </div>
              {collapsible && (
                <GhostAccordion open={collapsedIndex === rowIndex}>
                  {renderCollapsible(row)}
                </GhostAccordion>
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </>
  );
};

export default TableRow;
