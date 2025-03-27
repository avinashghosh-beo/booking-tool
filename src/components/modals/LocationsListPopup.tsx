import React from "react";
import Modal from "../hoc/Modal";
import { ButtonComponent } from "../common/Button";
import { IoLocation } from "react-icons/io5";
import { TrashIcon } from "../icons";
import { useTranslation } from "react-i18next";

interface LocationsListPopupProps {
  visible: boolean;
  title: string;
  text: string;
  onClose: Function;
  locations?: [];
  onDelete: Function;
}
const LocationsListPopup: React.FC<LocationsListPopupProps> = ({
  visible,
  title,
  text,
  onClose,
  locations = [],
  onDelete = () => {},
}) => {
  const { t } = useTranslation();
  return (
    <Modal isVisible={visible} onClose={onClose}>
      <div className="grid max-w-full gap-4">
        <div className="flex justify-between">
          <div>
            <div className="grid rounded-full size-12 bg-secondary-50 place-items-center">
              <div className="grid rounded-full place-content-center size-10 bg-secondary-100 text-secondary-500">
                <IoLocation />
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <p className="mb-2 font-semibold">{t("labels.locations")}</p>

          <div className="pr-2 overflow-hidden overflow-y-auto max-h-96">
            {locations.map((item, index) => (
              <div
                key={index}
                className="flex flex-row items-center justify-between p-2 mb-2 text-sm rounded-md bg-primary-200"
              >
                <p>{item.plz_name}</p>
                <button
                  onClick={() => onDelete(item.value)}
                  className="p-2 bg-gray-100 rounded-md text-md text-danger-700"
                >
                  <TrashIcon className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <ButtonComponent
            buttonStyle="w-full"
            colorScheme="primary"
            onClick={onClose}
            title="Close"
            size="md"
          />
        </div>
      </div>
    </Modal>
  );
};

export default LocationsListPopup;
