import React from "react";
import Modal from "../hoc/Modal";
import { Setting2Icon } from "../icons";
import { useTranslation } from "react-i18next";

interface ConfirmationModalProps {
  visible: boolean;
  onClose: Function;
  page: number;
  itemsPerPage: number;
  onPageChange: Function;
  onItemsPerPageChange: Function;
  totalPages: number;
}

const PaginationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  page,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  totalPages,
}) => {
  const { t } = useTranslation();
  const itemsCount = [10, 20, 30, 50, 100, 200];

  return (
    <Modal isVisible={visible} onClose={onClose}>
      <div className="grid max-w-lg gap-4 bg-white rounded-lg">
        <div className="flex justify-between">
          <div>
            <div className="grid rounded-full size-12 bg-primary-50 place-items-center">
              <div className="grid rounded-full place-content-center size-10 bg-primary-100 text-primary-500">
                <Setting2Icon />
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="mb-4 font-semibold">{t("shortStrings.itemsPerPage")}</p>
          <ul className="grid mb-4 grid-cols-6 *:border :border-primary-200 gap-4 text-center *:rounded-lg *:py-2 text-primary-700 border-md font-semibold">
            {itemsCount.map((item, index) => (
              <li
                onClick={() => onItemsPerPageChange(item)}
                key={index}
                className={
                  item === itemsPerPage
                    ? "text-white bg-primary-800"
                    : "hover:bg-primary-400"
                }
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mb-4 font-semibold">
            {t("shortStrings.pages")}: {page + 1} |{" "}
            {t("shortStrings.currentPage")}: {itemsPerPage}
          </p>
          <ul className="grid grid-cols-5 *:border :border-primary-200 gap-4 text-center *:rounded-lg *:py-2 text-primary-700 border-md font-semibold max-h-64 overflow-hidden overflow-y-auto">
            {Array(totalPages)
              .fill("_")
              .map((_, index) => (
                <li
                  key={index}
                  onClick={() => onPageChange(index + 1)}
                  className={
                    page === index + 1
                      ? "text-white bg-primary-800"
                      : "hover:bg-primary-400"
                  }
                >
                  {index + 1}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default PaginationModal;
