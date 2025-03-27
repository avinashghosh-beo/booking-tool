import React, { ReactElement } from "react";
import { NumericFormat } from "react-number-format";
import { ButtonComponent, SelectButton } from "../common/Button";
import StepstoneIcon from "../../assets/Icons/StepstoneIcon.png";
import { IoEyeOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import pluralize from "pluralize";
import { dateFormat } from "../../utils/dateformat";
import { useTranslation } from "react-i18next";

const CDN_URL = import.meta.env.VITE_APP_CDN;

export const companiesArray = [
  {
    name: "Stepstone",
    runtime: "30 days runtime",
    amount: 3000,
    icon: StepstoneIcon,
  },
  {
    name: "Stepstone",
    runtime: "30 days runtime",
    amount: 3000,
    icon: StepstoneIcon,
  },
  {
    name: "Stepstone",
    runtime: "30 days runtime",
    amount: 3000,
    icon: StepstoneIcon,
  },
];

interface CompaniesPricingCardProps {
  key: number;
  name: string;
  icon: string | ReactElement;
  runtime: string;
  amount: number;
}

export const CompaniesPricingCard: React.FC<CompaniesPricingCardProps> = ({
  name,
  icon,
  runtime,
  amount,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between py-4 border-b border-primary-500/20 last:border-b-0 last:pb-0 first:pt-0">
      <div className="flex items-center gap-2">
        <img className="w-5" src={icon} alt={t("ariaLabels.jobwareLogo")} />
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>
      <div className="flex items-center justify-center flex-grow gap-2">
        <h3>{runtime}</h3>
      </div>
      <div className="flex items-center gap-2">
        <h3>
          <NumericFormat
            decimalScale={3}
            displayType="text"
            value={amount}
            prefix="€"
            thousandSeparator
          />
        </h3>
        <button className="text-primary-500">
          <IoEyeOutline size={18} />
        </button>
      </div>
    </div>
  );
};

interface PortalCostListingCardProps {
  onClick: Function;
  selected: boolean;
  data: {};
  gridColumns?: number;
  showTitle?: boolean;
}

const PortalCostListingCard: React.FC<PortalCostListingCardProps> = ({
  onClick,
  selected,
  data,
  gridColumns = 2,
  showTitle = false,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`p-4 border rounded-md ${
        selected ? "border-primary-400 bg-primary-100" : "border-primary-200"
      }`}
    >
      <div className="flex items-center justify-between pb-2">
        {showTitle && (
          <h3 className="font-semibold text-primary-600">
            {data?.AnbieterDaten?.AnbieterName}
          </h3>
        )}
        <h3 className="font-semibold text-secondary-600">
          <NumericFormat
            decimalScale={3}
            displayType="text"
            value={data?.Price}
            prefix="€"
            thousandSeparator
          />
        </h3>
      </div>
      <div
        className={`grid  gap-4 *:rounded-lg *:bg-primary-200 *:px-4 *:py-2.5 text-center *:text-primary-800 font-medium md:grid-cols-${gridColumns}`}
      >
        <div className="grid place-items-center">
          <img
            src={CDN_URL + data?.AnbieterDaten?.LogoName || StepstoneIcon}
            alt={t("ariaLabels.stepStoneLogo")}
            className="max-h-7 mix-blend-multiply"
          />
        </div>
        {data?.AllowedLocations && (
          <div>{`${data?.AllowedLocations} ${pluralize(
            t("labels.location"),
            data?.AllowedLocations
          )}`}</div>
        )}
        <div>{t("labels.runtime")}</div>
        <div>{t("embeddedStrings.refreshCount", { count: 3 })}</div>
      </div>

      <div className="pt-4">
        <ButtonComponent
          iconPlacement="right"
          buttonStyle="w-full"
          colorScheme="primary"
          icon={<FaPlus className="ml-2" />}
          onClick={onClick}
          title={t("buttonLabels.add")}
          size="sm"
        />
      </div>
    </div>
  );
};

export const PortalCostListingCardSkeleton = () => {
  return (
    <div className={`p-4 border rounded-md border-primary-200`}>
      <Skeleton height={18} width={60} className="mb-2" />
      <Skeleton height={42} className="mb-4" />
      <Skeleton height={42} className="mb-5" />
      <Skeleton height={38} className="mb-0" />
    </div>
  );
};

export default PortalCostListingCard;
