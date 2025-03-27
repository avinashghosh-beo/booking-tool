import React from "react";
import Modal from "../hoc/Modal";
import { CloseCircleIcon, TrashIcon } from "../icons";
import { ButtonComponent } from "../common/Button";
import { useTranslation } from "react-i18next";

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  text: string;
  onClose: Function;
  onConfirm: Function;
  type: "delete" | "confirm";
  isLoading?: boolean;
}
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  text,
  onClose,
  onConfirm,
  type,
  isLoading,
}) => {
  const { t } = useTranslation();
  const icons = {
    delete: (
      <div className="grid rounded-full place-content-center size-10 bg-danger-100 text-danger-500">
        <TrashIcon />
      </div>
    ),
    confirm: (
      <div className="grid rounded-full place-content-center size-10 bg-secondary-100 text-secondary-500">
        <CloseCircleIcon />
      </div>
    ),
  };

  const buttonConfirm = {
    delete: (
      <ButtonComponent
        buttonStyle="w-full"
        colorScheme="primary"
        onClick={onConfirm}
        title={t("buttonLabels.delete")}
        size="md"
        loading={isLoading}
      />
    ),
    confirm: (
      <ButtonComponent
        buttonStyle="w-full"
        colorScheme="primary"
        onClick={onConfirm}
        title={t("buttonLabels.confirm")}
        size="md"
        loading={isLoading}
      />
    ),
  };

  const buttonCancel = {
    delete: (
      <ButtonComponent
        buttonStyle="w-full"
        colorScheme="light"
        onClick={onClose}
        title={t("buttonLabels.cancel")}
        size="md"
      />
    ),
    confirm: (
      <ButtonComponent
        buttonStyle="w-full"
        colorScheme="light"
        onClick={onClose}
        title={t("buttonLabels.cancel")}
        size="md"
      />
    ),
  };

  return (
    <Modal isVisible={visible} onClose={onClose}>
      <div className="grid max-w-full gap-4">
        <div className="flex justify-between">
          <div>
            <div className="grid rounded-full size-12 bg-secondary-50 place-items-center">
              <div className="grid rounded-full place-content-center size-10 bg-secondary-100 text-secondary-500">
                {icons[type]}
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="font-semibold ">{title}</p>
          <p>{text}</p>
        </div>
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          {buttonCancel[type]}
          {buttonConfirm[type]}
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
