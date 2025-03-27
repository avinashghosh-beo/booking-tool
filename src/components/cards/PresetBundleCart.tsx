import React, { ReactElement, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import { ButtonComponent } from "../common/Button";
import StepstoneIcon from "../../assets/Icons/StepstoneIcon.png";
import { TagCrossIcon, TrashIcon } from "../icons";
import Skeleton from "react-loading-skeleton";
import { GhostAccordion } from "../common/Accordion";
import { removeItemById } from "../../utils/array";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { calculatePrice } from "../../screens/BookingTool/api";

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

interface PortalPricingCardProps {
  key: number;
  ProductName: string;
  icon: string | ReactElement;
  runtime: string;
  amount: number;
  handleRemove?: Function;
}

export const PortalPricingCard: React.FC<PortalPricingCardProps> = ({
  ProductName,
  icon,
  runtime,
  amount,
  handleRemove = () => {},
}) => (
  <div className="flex justify-between py-4 border-b border-primary-500/20 last:border-b-0 last:pb-0 first:pt-0">
    <div className="flex items-center gap-2">
      <img className="w-5 mix-blend-multiply" src={icon} alt="Jobware" />
      <h3 className="text-md">{ProductName}</h3>
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
      <button onClick={() => handleRemove()} className="text-danger-500">
        <TrashIcon />
      </button>
    </div>
  </div>
);

interface PresetBundleCartProps {
  cartItems: any[];
  removeItem: (id: string) => void;
  clearCart: () => void;
  company: string;
  isError: boolean;
}

const PresetBundleCart: React.FC<PresetBundleCartProps> = ({
  cartItems,
  removeItem,
  clearCart,
  company,
  isError,
}) => {
  const { t } = useTranslation();

  // Price calculation query with memoized dependencies
  const priceQuery = useQuery({
    queryKey: ["presetCart", cartItems.map((item) => item.ID)], // More stable query key
    queryFn: () =>
      calculatePrice({
        company: company.value,
        bookingType: "Custom",
        productIds: cartItems.map((item) => item.ID),
      }),
    select: (res) => res.data,
    enabled: cartItems.length > 0,
  });

  return (
    <div className="p-4 bg-white border rounded-md border-primary-200">
      <div className="flex items-center justify-between pb-2">
        <h3 className="font-medium text-primary">{t("shortStrings.cart")}</h3>
        {cartItems?.length > 0 && (
          <ButtonComponent
            icon={<TagCrossIcon />}
            colorScheme="default"
            title={t("shortStrings.clear")}
            onClick={clearCart}
          />
        )}
      </div>
      <div className={"px-6 py-4 mb-2 rounded-lg bg-primary-100/30"}>
        {cartItems?.map((item, index) => (
          <PortalPricingCard
            key={index} // Use ID instead of index for stable keys
            {...item}
            icon={CDN_URL + item?.AnbieterDaten?.LogoName}
            handleRemove={() => removeItem(item.ID)}
          />
        ))}
        <GhostAccordion open={cartItems?.length < 1}>
          <div className="flex items-center justify-center h-64">
            {t("shortStrings.cartEmpty")}
          </div>
        </GhostAccordion>
      </div>

      <GhostAccordion
        open={isError}
        children={
          <div className="text-danger-500 mb-4">
            *{t("errorMessages.cartCannotBeEmpty")}
          </div>
        }
      />

      {/* Price Summary Section */}
      {cartItems?.length > 0 && <PriceSummary priceData={priceQuery.data} />}
    </div>
  );
};

// Separate price summary component to reduce re-renders
const PriceSummary = React.memo(({ priceData }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex justify-between pb-2">
        <h3>{t("shortStrings.summarizedPrice")}</h3>
        <h3 className="font-semibold text-secondary-600">
          <NumericFormat
            decimalScale={3}
            displayType="text"
            value={priceData?.grossAmount}
            prefix="€"
            thousandSeparator
          />
        </h3>
      </div>
    </>
  );
});

export const PresetBundleCartSkeleton: React.FC = ({}) => {
  return (
    <div className={`p-4 border rounded-md border-primary-200`}>
      <Skeleton height={48} className="mb-2" />
      <Skeleton height={56} className="mb-0" />
      <Skeleton height={56} className="mb-0" />
      <Skeleton height={56} className="mb-2" />
      <Skeleton height={12} className="mb-0" />
      <Skeleton height={12} className="mb-4" />
      <Skeleton height={14} className="mb-0" />
    </div>
  );
};

export default PresetBundleCart;
