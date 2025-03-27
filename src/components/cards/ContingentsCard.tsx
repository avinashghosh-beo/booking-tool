import React, { useMemo } from "react";
import StepStoneLogo from "../../assets/Icons/StepStoneLogo.png";
import { ArrowDownIcon } from "../icons";
import ProgressBar from "../common/ProgressBar";
import TabView from "../common/TabView";
import { GhostAccordion } from "../common/Accordion";
import DataTable from "../tables";
import { ButtonComponent } from "../common/Button";
import { dateFormat } from "../../utils/dateformat";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";

interface ContingentsCardProps {
  data: {};
  type: "Budget" | "Fixed" | "Free";
  setExpanded: Function;
  isExpanded?: boolean;
  onClickUse?: Function;
}
const CDN_URL = import.meta.env.VITE_APP_CDN;

const ContingentsCard: React.FC<ContingentsCardProps> = ({
  data,
  type,
  setExpanded,
  isExpanded,
  onClickUse = () => {},
}) => {
  const { t } = useTranslation();
  const productsArray = useMemo(() => {
    if (type === "Budget") return data?.BudgetCreditsProducts;
    else if (type === "Fixed") return data?.SalesDocument?.SalesDocumentItems;
    else return data?.Products;
  }, [data, type]);

  const tabs = [
    {
      id: 0,
      title: t("labels.jobadsUsedInContingent"),
      component: <DataTable name="jobadsUsedinContingent" />,
    },
    {
      id: 1,
      title: t("labels.invoice"),
      component: <DataTable name="contingentInvoiceTable" />,
    },
  ];

  return (
    <div
      className={`transition-all duration-300 ease-in-out pb-4 ${
        isExpanded ? "col-span-2 mb-4" : "col-span-1"
      }`}
    >
      <div className="p-4 rounded-lg bg-primary-100">
        {type !== "Budget" && (
          <div className="pb-2">
            <ButtonComponent
              size="md"
              buttonStyle="w-full"
              colorScheme="primary"
              title={t("buttonLabels.useContingent")}
              onClick={() => onClickUse()}
            />
          </div>
        )}
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
        {productsArray.map((item, index) => (
          <div className="pb-2" key={index}>
            {type === "Budget" && (
              <div className="pb-4">
                <ButtonComponent
                  size="md"
                  buttonStyle="w-full"
                  colorScheme="primary"
                  title={t("buttonLabels.useContingent")}
                  onClick={() =>
                    onClickUse({ ...data, BudgetCreditsProducts: item })
                  }
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
                    alt="Product Logo"
                    className="max-h-7 mix-blend-multiply"
                  />
                ) : (
                  <img
                    src={
                      CDN_URL + item.Product?.AnbieterDaten?.LogoName ||
                      StepStoneLogo
                    }
                    alt="Product Logo"
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
        {isExpanded && (
          <div className="relative">
            <button
              onClick={() => setExpanded()}
              className="absolute flex items-center gap-1 px-2 py-1 text-sm leading-none transform -translate-x-1/2 -translate-y-1/2 border rounded-md text-primary-800 top-4 left-1/2 absoulte border-primary-400 w-max bg-primary-200"
            >
              {isExpanded ? t("buttonLabels.hide") : t("buttonLabels.seeAds")}
              <ArrowDownIcon className={"size-5 rotate-180"} />
            </button>
          </div>
        )}
        <GhostAccordion open={isExpanded}>
          <div className="max-w-full">
            {isExpanded && <TabView tabs={tabs} />}
          </div>
        </GhostAccordion>
        {!isExpanded && (
          <div className="relative">
            <button
              onClick={() => setExpanded()}
              className="absolute flex items-center gap-1 px-2 py-1 text-sm leading-none transform -translate-x-1/2 -translate-y-1/2 border rounded-md text-primary-800 top-4 left-1/2 absoulte border-primary-400 w-max bg-primary-200"
            >
              {isExpanded ? t("buttonLabels.hide") : t("buttonLabels.seeAds")}
              <ArrowDownIcon className={"size-5"} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export const ContingentsSkeleton = ({ rows = 1 }) => (
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

export default ContingentsCard;
