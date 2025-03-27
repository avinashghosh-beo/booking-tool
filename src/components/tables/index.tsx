import React, { useState } from "react";
import useTableData from "../../hooks/useTableData";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import Pagination from "../common/Pagination";

interface DataTableProps {
  name: string;
  showPagination?: boolean;
  filters?: {};
  params?: {};
}

const DataTable: React.FC<DataTableProps> = ({
  name,
  showPagination,
  filters = {},
  params = {},
}) => {
  const {
    renderCollapsible,
    collapsible,
    columns = [],
    data = [],
    tableWidth = 100,
    updateOptions,
    options = {},
    columnRatios,
    totalRecords,
    isLoading,
    isFetching,
    isSuccess,
  } = useTableData({ tableName: name, filters, params });
  const [page, setPage] = useState(0);
  // Ensure tableWidth stays between 5% and 100%
  const clampedWidth = Math.min(100, Math.max(5, tableWidth));

  const totalRatio = columnRatios.reduce((sum, ratio) => sum + ratio, 0);
  const columnWidths = columnRatios.map((ratio) => (ratio / totalRatio) * 100);

  const handleItemsPerPageChange = (limit) => {
    updateOptions({ limit: limit });
  };

  const handlePageChange = (number) => {
    setPage(number);
    updateOptions({ skip: number * options.limit });
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div
          className="w-fit min-w-full"
          // style={{ width: `${clampedWidth}%` }}
        >
          {/* Table Header */}
          <TableHeader
            options={options}
            updateOptions={updateOptions}
            columnWidths={columnWidths}
            columns={columns}
          />
          {/* Table Rows */}
          <TableRow
            isLoading={isLoading || isFetching}
            collapsible={collapsible}
            renderCollapsible={renderCollapsible}
            columnWidths={columnWidths}
            data={data}
            columns={columns}
          />
        </div>
      </div>
      {showPagination && totalRecords > 0 && (
        <Pagination
          setItemsPerPage={handleItemsPerPageChange}
          totalRecords={totalRecords}
          itemsPerPage={options.limit}
          page={page}
          onPageChange={handlePageChange}
          totalPages={Math.ceil(totalRecords / options.limit)}
        />
      )}
    </>
  );
};

export default DataTable;
