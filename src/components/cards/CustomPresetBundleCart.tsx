import React, { ReactElement, useMemo } from "react";
import { NumericFormat } from "react-number-format";
import { ButtonComponent } from "../common/Button";
import StepstoneIcon from "../../assets/Icons/StepstoneIcon.png";
import { TagCrossIcon, TrashIcon } from "../icons";
import Skeleton from "react-loading-skeleton";
import { GhostAccordion } from "../common/Accordion";
import { useFormContext } from "react-hook-form";
import { removeItemById } from "../../utils/array";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { calculatePrice } from "../../screens/BookingTool/api";
import { usePortals } from "../../hooks/usePortals";

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

interface CustomPresetBundleCartProps {}

const CustomPresetBundleCart: React.FC<CustomPresetBundleCartProps> = ({}) => {
  const { t } = useTranslation();
  const { setValue, watch } = useFormContext();
  const { portalsData } = usePortals();

  // Memoize cart data to prevent unnecessary re-renders
  const cartData = useMemo(() => {
    const cart = watch("portalsCart") || [];
    return {
      items: cart,
      ids: cart.map((item) => item.ID),
      type: watch("currentCartItemType"),
    };
  }, [watch("portalsCart"), watch("currentCartItemType")]);

  // Price calculation query with memoized dependencies
  const priceQuery = useQuery({
    queryKey: ["priceQuery", cartData.ids], // More stable query key
    queryFn: () =>
      calculatePrice({
        company: watch("RecieverCompany")?.value,
        bookingType: "Custom",
        productIds: cartData.ids,
      }),
    select: (res) => res.data,
    enabled:
      cartData.ids.length > 0 &&
      cartData.type === "paid"
  });

  const handleRemove = (id: string) => {
    const newArray = removeItemById(cartData.items, id);
    setValue("portalsCart", newArray);
  };

  const handleClear = () => {
    setValue("portalsCart", []);
  };

  return (
    <div className="p-4 bg-white border rounded-md border-primary-200">
      <div className="flex items-center justify-between pb-2">
        <h3 className="font-medium text-primary">{t("shortStrings.cart")}</h3>
        {cartData.items.length > 0 && (
          <ButtonComponent
            icon={<TagCrossIcon />}
            colorScheme="default"
            title={t("shortStrings.clear")}
            onClick={handleClear}
          />
        )}
      </div>
      <div className={"px-6 py-4 mb-2 rounded-lg bg-primary-100/30"}>
        {cartData.items.map((item, index) => (
          <PortalPricingCard
            key={index} // Use ID instead of index for stable keys
            {...item}
            icon={CDN_URL + item?.AnbieterDaten?.LogoName}
            handleRemove={() => handleRemove(item.ID)}
          />
        ))}
        <GhostAccordion open={cartData.items.length < 1}>
          <div className="flex items-center justify-center h-64">
            {t("shortStrings.cartEmpty")}
          </div>
        </GhostAccordion>
      </div>

      {/* Price Summary Section */}
      {cartData.items.length > 0 && (
        <PriceSummary type={cartData.type} priceData={priceQuery.data} />
      )}
    </div>
  );
};

// Separate price summary component to reduce re-renders
const PriceSummary = React.memo(({ type, priceData }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex justify-between pb-2">
        <h3>{t("shortStrings.summarizedPrice")}</h3>
        <h3 className="font-semibold text-secondary-600">
          <NumericFormat
            decimalScale={3}
            displayType="text"
            value={type === "paid" ? priceData?.grossAmount : 0}
            prefix="€"
            thousandSeparator
          />
        </h3>
      </div>
      {/* <div className="flex justify-between pb-2">
        <h3>{t("shortStrings.yourDiscount")}</h3>
        <h3 className="font-semibold text-danger-600">
          <NumericFormat
            decimalScale={3}
            displayType="text"
            value={`-${type === "paid" ? priceData?.discountAmount : 0}`}
            prefix="€"
            thousandSeparator
          />
        </h3>
      </div> */}
      {/* <div className="flex justify-between pb-2">
        <h3>{t("shortStrings.tax")}</h3>
        <h3 className="font-semibold text-secondary-600">
          <NumericFormat
            decimalScale={3}
            displayType="text"
            value={type === "paid" ? priceData?.taxAmount : 0}
            prefix="€"
            thousandSeparator
          />
        </h3>
      </div> */}
      {/* <hr className="mb-2 border-t-2 border-primary-100" />
      <div className="flex justify-between">
        <h3 className="font-bold">{t("shortStrings.endPrice")}</h3>
        <h3 className="font-semibold text-success-600">
          <NumericFormat
            decimalScale={3}
            displayType="text"
            value={type === "paid" ? priceData?.netAmount : 0}
            prefix="€"
            thousandSeparator
          />
        </h3>
      </div> */}
    </>
  );
});

export const CustomPresetBundleCartSkeleton: React.FC = ({}) => {
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

export default CustomPresetBundleCart;
