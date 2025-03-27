import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import { ButtonComponent, SelectButton } from "../common/Button";
import { PencilIcon, TrashIcon } from "../icons";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";
import { Network, Star } from "lucide-react";
import AddFavouriteBundle from "../modals/AddFavouriteBundle";

declare global {
  interface ImportMeta {
    env: {
      VITE_APP_CDN: string;
    };
  }
}

const CDN_URL = import.meta.env.VITE_APP_CDN;

interface Product {
  ID: string;
  ProductName: string;
  Price: number;
  AllowedLocations: number | null;
  RegionAllowed: boolean;
  RemoteAllowed: boolean;
  GermanyWideAllowed: boolean;
  MaxCharacter: number;
  AnbieterDaten: {
    ID: string;
    AnbieterName: string;
    LogoName: string;
  };
}

interface BundlePricing {
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  taxAmount: number;
  taxableAmount: number;
  productCount: number;
}

interface CompaniesPricingCardProps {
  ProductName: string;
  icon: string;
  runtime?: string;
  amount: number;
}

export const CompaniesPricingCard: React.FC<CompaniesPricingCardProps> = ({
  ProductName,
  icon,
  runtime = "60 days",
  amount,
}) => (
  <div className="flex justify-between py-4 border-b border-primary-500/20 last:border-b-0 last:pb-0 first:pt-0">
    <div className="flex items-center gap-2">
      <img
        className="w-5 mix-blend-multiply"
        src={icon ? CDN_URL + icon : ""}
        alt={ProductName}
      />
      <h3 className="text-md break-words">{ProductName}</h3>
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
    </div>
  </div>
);

interface PresetBundleCardProps {
  editable?: boolean;
  isCustom?: boolean;
  onClick: Function;
  onEdit?: Function;
  onDelete?: Function;
  selected: boolean;
  Name?: string;
  Products: Product[];
  pricing?: BundlePricing;
  type?: "COMPANY" | "PUBLIC";
  setShowOptions?: Function;
  showAddToFavourite?: boolean;
  id?: string;
  disableInteractions?: boolean;
}

const PresetBundleCard: React.FC<PresetBundleCardProps> = ({
  editable = false,
  isCustom,
  onClick,
  selected,
  Name = "Name of Preset",
  Products = [],
  pricing,
  onEdit,
  onDelete,
  type = "COMPANY",
  setShowOptions = () => {},
  showAddToFavourite = false,
  id,
  disableInteractions = false,
}) => {
  const { t } = useTranslation();
  const [showAddToFavouriteModalData, setShowAddToFavouriteModalData] =
    useState(null);

  return (
    <div
      className={`p-4 border rounded-md ${
        selected
          ? "border-primary-400 bg-primary-100 transition-colors"
          : "border-primary-200"
      }`}
    >
      <AddFavouriteBundle
        bundleId={id}
        bundleName={Name}
        isVisible={showAddToFavouriteModalData !== null}
        onClose={() => setShowAddToFavouriteModalData(null)}
        loading={false}
      />
      <div className="flex items-center justify-between pb-2">
        <h3 className="font-medium text-primary">{Name}</h3>

        {editable ? (
          <div className="flex flex-row gap-x-2">
            {type === "COMPANY" ? (
              <>
                <ButtonComponent
                  disabled={disableInteractions}
                  colorScheme="default"
                  icon={<PencilIcon className={"h-5 w-5 text-primary-500"} />}
                  onClick={onEdit}
                />
                <ButtonComponent
                  disabled={disableInteractions}
                  colorScheme="default"
                  icon={<TrashIcon className={"h-5 w-5 text-danger-500"} />}
                  onClick={onDelete}
                />
              </>
            ) : (
              <>
                <ButtonComponent
                  disabled={disableInteractions}
                  colorScheme="default"
                  icon={<Network className="h-5 w-5 text-primary-500" />}
                  onClick={() => {
                    setShowOptions(true);
                  }}
                />
              </>
            )}

            {showAddToFavourite && (
              <ButtonComponent
                disabled={disableInteractions}
                colorScheme="default"
                icon={<Star className="h-5 w-5 text-primary-500" />}
                onClick={() => {
                  setShowAddToFavouriteModalData({
                    name: Name,
                    id: id,
                  });
                }}
              />
            )}
          </div>
        ) : (
          <div>
            <SelectButton
              disabled={disableInteractions}
              style=""
              selected={selected}
              text={t("buttonLabels.bookDirectly")}
              onSelect={onClick}
            />
          </div>
        )}
      </div>
      <div
        className={`px-6 py-4 mb-2 rounded-lg ${
          selected ? "bg-primary-700/10" : "bg-primary-100/30"
        }`}
      >
        {Products &&
          Products.map((item, index) => (
            <CompaniesPricingCard
              key={index}
              ProductName={item.ProductName}
              icon={item.AnbieterDaten?.LogoName || ""}
              amount={item.Price}
            />
          ))}
      </div>
      <div className="flex justify-between pb-2">
        <h3>{t("shortStrings.summarizedPrice")}</h3>
        <h3 className="font-semibold text-secondary-600">
          <NumericFormat
            decimalScale={3}
            displayType="text"
            value={pricing?.grossAmount}
            prefix="€"
            thousandSeparator
          />
        </h3>
      </div>
    </div>
  );
};

export const PresetBundleCardSkeleton: React.FC = () => {
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

export default PresetBundleCard;
