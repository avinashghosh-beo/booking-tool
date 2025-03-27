import React, { useMemo, useState } from "react";
import StepStoneLogo from "../../assets/Icons/StepStoneLogo.png";
import ProgressBar from "../common/ProgressBar";
import { SelectButton } from "../common/Button";
import { useTranslation } from "react-i18next";
import { dateFormat } from "../../utils/dateformat";
import Skeleton from "react-loading-skeleton";

interface ContingentsPickerCardProps {
  data: {};
  onSelect?: Function;
  selected?: boolean;
  type?: "Budget" | "Fixed" | "Free";
}

const CDN_URL = import.meta.env.VITE_APP_CDN;

const ContingentsPickerCard: React.FC<ContingentsPickerCardProps> = ({
  data,
  onSelect = () => {},
  selected = false,
  type = "Budget",
}) => {
  const { t } = useTranslation();

  const productsArray = useMemo(() => {
    if (type === "Budget") return data?.BudgetCreditsProducts;
    else if (type === "Fixed") return data?.SalesDocument?.SalesDocumentItems;
    else return data?.Products;
  }, [data, type]);

  return (
    <div className="">
      <div className="p-4 transition-all duration-300 ease-in-out rounded-lg bg-primary-100 ">
        <div className="flex flex-row items-center justify-between">
          <h3 className="font-medium text-primary">{t("labels.contingentName")}</h3>
          {type !== "Budget" && (
            <div className="w-fit">
              <SelectButton
                style=""
                selected={selected}
                text={t("buttonLabels.useThisContingent")}
                onSelect={onSelect}
              />
            </div>
          )}
        </div>
        <div className="p-2">
          <ProgressBar
            step={data?.CreditsLeft}
            totalSteps={data?.CreditsTotal}
          />
          <div className="flex items-center justify-between text-primary-600">
            <span className="font-medium">
              {`${type === "Budget" ? "€" : ""} ${data?.CreditsTotal}`}
            </span>
            <span className="font-bold">
              {`${type === "Budget" ? "€" : ""} ${data?.CreditsLeft} ${t("labels.available")}`}
            </span>
          </div>
        </div>
        {productsArray?.map((item, index) => (
          <div className="pb-2" key={index}>
            {type === "Budget" && (
              <div className="pb-4">
                <SelectButton
                  style=""
                  selected={selected}
                  text={t("buttonLabels.useThisContingent")}
                  onSelect={() => {
                    onSelect({ ...data, BudgetCreditsProducts: item });
                  }}
                />
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4 *:rounded-lg *:bg-primary-200 *:px-4 *:py-2.5 text-center *:text-primary-800 font-medium pb-2">
              <div className="grid place-items-center">
                {type === "Free" ? (
                  <img
                    src={
                      CDN_URL + item?.AnbieterDaten?.LogoName || StepStoneLogo
                    }
                    alt={t("ariaLabels.productLogo")}
                    className="max-h-7 mix-blend-multiply"
                  />
                ) : (
                  <img
                    src={
                      CDN_URL + item.Product?.AnbieterDaten?.LogoName ||
                      StepStoneLogo
                    }
                    alt={t("ariaLabels.productLogo")}
                    className="max-h-7 mix-blend-multiply"
                  />
                )}
              </div>
              <div>
                {type === "Free" ? item.ProductName : item.Product?.ProductName}
              </div>
              <div>
                {t("labels.completedOn")}{" "}
                <span className="font-bold">{dateFormat(item.CreatedOn)}</span>
              </div>
              <div>
                {t("labels.validUntil")}{" "}
                <span className="font-bold">{dateFormat(item.BuyingDate)}</span>
              </div>
            </div>
            {index < productsArray.length - 1 && (
              <div className="h-px bg-primary-300"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ContingentsPickerSkeleton = ({ rows = 2 }) => (
  <div className="p-4 rounded-lg bg-primary-100">
    <div className="grid grid-cols-2 gap-4 pb-4">
      <Skeleton height={40} />
      <Skeleton height={40} />
    </div>
    <div>
      <Skeleton height={10} />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Skeleton height={10} width={70} />
      <Skeleton height={10} />
    </div>
    {Array(rows)
      .fill("")
      .map((_, index) => (
        <React.Fragment key={index}>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Skeleton height={40} />
            <Skeleton height={40} />
            <Skeleton height={40} />
            <Skeleton height={40} />
          </div>
          {index < rows - 1 && (
            <div>
              <Skeleton height={2} />
            </div>
          )}
        </React.Fragment>
      ))}
  </div>
);

export default ContingentsPickerCard;
