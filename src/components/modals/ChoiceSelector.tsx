import React from "react";
import Modal from "../hoc/Modal";
import { CloseCircleIcon } from "../icons";
import { ButtonComponent } from "../common/Button";

interface ChoiceSelectorModalProps {
  visible: boolean;
  title: string;
  text: string;
  onClose: Function;
  onConfirm: Function;
  renderChoices: Function;
  gridStyle: string;
}
const ChoiceSelectorModal: React.FC<ChoiceSelectorModalProps> = ({
  visible,
  title,
  text,
  onClose,
  onConfirm,
  renderChoices,
  gridStyle,
}) => {
  return (
    <Modal size="xl" isVisible={visible} onClose={onClose}>
      <div className="grid max-w-full gap-4">
        <div className="flex justify-between">
          <div>
            <div className="grid rounded-full size-12 bg-secondary-50 place-items-center">
              <div className="grid rounded-full place-content-center size-10 bg-secondary-100 text-secondary-500">
                <div className="grid rounded-full place-content-center size-10 bg-secondary-100 text-secondary-500">
                  <CloseCircleIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="font-semibold ">{title}</p>
          <p>{text}</p>
        </div>
        <div
          className={`grid grid-cols-1 gap-4 max-h-96 overflow-hidden overflow-y-auto ${gridStyle}`}
        >
          {renderChoices()}
        </div>
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <ButtonComponent
            colorScheme="light"
            onClick={onConfirm}
            title="Cancel"
            size="md"
            buttonStyle="w-full"
          />
          <ButtonComponent
            colorScheme="primary"
            onClick={onConfirm}
            title="Select"
            buttonStyle="w-full"
            size="md"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ChoiceSelectorModal;
