import React from "react";
import Modal from "../hoc/Modal";
import { InfinityIcon, RadarIcon, Warning2Icon } from "../icons";
import { ButtonComponent, SelectButton } from "../common/Button";
import Chip from "../common/Chip";
import { useTranslation } from "react-i18next";

interface UpgradePlanModalProps {
  visible: boolean;
  title?: string;
  text?: string;
  onClose: Function;
  onConfirm: Function;
  selectedPlanId: number;
}

const plans = [
  {
    id: 1,
    noOfUsers: 10,
    costPerMonth: 49,
    noOfFreeListings: 10,
    isPopular: false,
  },
  {
    id: 2,
    noOfUsers: null,
    costPerMonth: 495,
    noOfFreeListings: null,
    isPopular: true,
  },
  {
    id: 3,
    noOfUsers: 50,
    costPerMonth: 195,
    noOfFreeListings: 50,
    isPopular: false,
  },
];

const UpgradePlanModal: React.FC<UpgradePlanModalProps> = ({
  visible,
  title = "",
  text = "",
  onClose,
  onConfirm,
  selectedPlanId = 1,
}) => {
  const { t } = useTranslation();
  return (
    <Modal size="4xl" isVisible={visible} onClose={onClose}>
      <div className="grid max-w-full gap-4">
        <div className="flex justify-between">
          <div>
            <div className="grid rounded-full size-12 bg-secondary-50 place-items-center">
              <div className="grid rounded-full place-content-center size-10 bg-secondary-100 text-secondary-500">
                <div className="grid rounded-full place-content-center size-10 bg-danger-100 text-danger-500">
                  <Warning2Icon />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="font-semibold ">{title}</p>
          <p>{text}</p>
        </div>
        <div className="flex flex-row justify-between p-4 gap-x-8">
          {plans.map((item, index) => (
            <PlanItem
              onClick={() => onConfirm(item)}
              selected={selectedPlanId === item?.id}
              key={index}
              {...item}
            />
          ))}
        </div>
        <div className="flex flex-row items-center justify-center p-2 mt-2 text-xs rounded bg-secondary-100 text-secondary-700 gap-x-2">
          <RadarIcon />
          {t("strings.quoteIsFree")}
        </div>
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
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
            onClick={onConfirm}
            title={t("buttonLabels.submit")}
            size="md"
          />
        </div>
      </div>
    </Modal>
  );
};

const PlanItem = ({
  selected,
  onClick,
  noOfFreeListings,
  noOfUsers,
  costPerMonth,
  isPopular,
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={`p-4 flex-1 flex flex-col transform transition duration-300 justify-center items-center border border-dashed bg-primary-100 rounded-md ${
        selected
          ? "border-primary-800 scale-110"
          : "border-primary-200 hover:scale-110"
      }`}
    >
      <div className="grid w-16 h-16 text-xl font-medium rounded-full bg-primary-300 place-items-center">
        {noOfUsers ? noOfUsers : <InfinityIcon className="h-8" />}
      </div>
      <p className="py-4 text-lg font-medium">
        {t("embeddedStrings.forEuroPerMonth", { cost: costPerMonth })}
      </p>
      <p className="pb-4 text-sm font-medium text-center text-black-700">
        {noOfFreeListings ? noOfFreeListings : t("shortStrings.unlimited")}{" "}
        {t("strings.freeListingsAtSameTime")}
      </p>

      <SelectButton
        text={t("buttonLabels.select")}
        selected={selected}
        onSelect={onClick}
      />
      <div className="pt-3">
        {isPopular && (
          <Chip showDot={false} type="success">
            {t("strings.mostPopularPlan")}
          </Chip>
        )}
      </div>
    </div>
  );
};

export default UpgradePlanModal;
