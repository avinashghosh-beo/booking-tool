import React, { useState } from "react";
import {
  ArrowSquareLeftIcon,
  ArrowSquareRightIcon,
  SettingIcon,
} from "../icons";
import { useTranslation } from "react-i18next";
import PaginationModal from "../modals/Pagination";

interface PaginationProps {
  onPageChange: Function;
  page: number;
  totalPages: number;
  itemsPerPage: number;
  totalRecords: number;
  setItemsPerPage: Function;
}

//FIXME: pagination upper limit
export const Pagination: React.FC<PaginationProps> = ({
  onPageChange,
  page,
  totalPages,
  totalRecords,
  itemsPerPage,
  setItemsPerPage,
}) => {
  const [showPaginationModal, setShowPaginationModal] = useState(false);
  const { i18n, t } = useTranslation();
  const handlePageIncrement = () => {
    if (page < totalPages - 1) onPageChange(page + 1);
  };
  const handelPageDecrement = () => {
    if (page > 0) onPageChange(page - 1);
  };

  return (
    <>
      <div className="flex items-center justify-center p-4">
        <div className="flex items-center gap-4">
          <button onClick={handelPageDecrement} className="cursor-pointer">
            <ArrowSquareLeftIcon />
          </button>
          {i18n.language === "en" ? (
            <span className="text-primary-400">
              Showing {page * itemsPerPage + 1} -{" "}
              {page * itemsPerPage + itemsPerPage} out of {totalRecords} records
            </span>
          ) : (
            <span className="text-primary-400">
              Zeige {page * itemsPerPage + 1} -{" "}
              {page * itemsPerPage + itemsPerPage} von {totalRecords}{" "}
              Datensätzen
            </span>
          )}
          <button onClick={handlePageIncrement} className="">
            <ArrowSquareRightIcon />
          </button>
          <span>{itemsPerPage}</span>
          <button
            onClick={() => setShowPaginationModal(true)}
            className="text-black-600"
          >
            <SettingIcon />
          </button>
        </div>
      </div>

      <PaginationModal
        visible={showPaginationModal}
        page={page}
        itemsPerPage={itemsPerPage}
        onClose={() => setShowPaginationModal((prev) => !prev)}
        onPageChange={onPageChange}
        onItemsPerPageChange={setItemsPerPage}
        totalPages={totalPages}
      />
    </>
  );
};

export default Pagination;
