import React, { useState } from "react";
import Modal from "../hoc/Modal";
import { Warning2Icon } from "../icons";
import { ButtonComponent } from "../common/Button";
import { useTranslation } from "react-i18next";

interface PaymentChoice {
  id: string;
  label: string;
  icon?: React.ReactNode;
  enabled?: boolean;
}

interface PaymentModeSelectorProps {
  visible: boolean;
  title?: string;
  text?: string;
  onClose: () => void;
  onConfirm: (choiceId) => void;
  paymentChoices: PaymentChoice[];
}

const PaymentModeSelector: React.FC<PaymentModeSelectorProps> = ({
  visible,
  title = "Payment",
  text = "Select the mode of payment to proceed with.",
  onClose,
  onConfirm,
  paymentChoices = [],
}) => {
  const { t } = useTranslation();
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const handleChoiceSelect = (choice: PaymentChoice) => {
    setSelectedChoice(choice.id);
  };

  return (
    <Modal size="lg" isVisible={visible} onClose={onClose}>
      <div className="grid max-w-full gap-4">
        <div>
          <p className="font-semibold">{title || t("labels.payment")}</p>
          <p className="text-sm text-gray-600">{text || t("strings.selectPaymentMode")}</p>
        </div>

        {/* Payment Choices Grid - 2 columns only */}
        <div className="grid grid-cols-2 gap-4">
          {paymentChoices.slice(0, 6).map((choice) => (
            <button
              disabled={!choice.enabled}
              key={choice.id}
              onClick={() => handleChoiceSelect(choice)}
              className={`
                aspect-square p-4 rounded-lg border-2 transition-all
                flex flex-col items-center justify-center gap-2 
                hover:bg-primary-50 hover:border-primary-300
                ${
                  selectedChoice === choice.id
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 bg-white"
                } ${!choice.enabled ? "cursor-not-allowed" : ""}
              `}
            >
              {/* Default icon if none provided */}
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                {choice.icon || (
                  <Warning2Icon className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <span className="text-sm font-medium text-center">
                {choice.label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex justify-between gap-4">
          <ButtonComponent
            buttonStyle="w-full"
            colorScheme="light"
            onClick={onClose}
            title={t("buttonLabels.cancel")}
            size="md"
          />
          <ButtonComponent
            buttonStyle="w-full"
            colorScheme="primary"
            onClick={() => {
              onConfirm(selectedChoice);
            }}
            title={
              selectedChoice === "manual"
                ? t("buttonLabels.submitAndMoveToPayment")
                : t("buttonLabels.submit")
            }
            size="md"
            disabled={!selectedChoice}
          />
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModeSelector;
