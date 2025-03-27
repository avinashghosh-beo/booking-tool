import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaCashRegister, FaClock } from "react-icons/fa";
import { usePortals } from "../../../hooks/usePortals";
import useToast from "../../../hooks/useToast";
import { useQuery } from "@tanstack/react-query";
import { calculatePrice } from "../api";
import { NumericFormat } from "react-number-format";
import pluralize from "pluralize";
import PaymentPage from "./Payment";
import ErrorMessages from "../../../components/common/ErrorMessages";
import { ChevronLeftIcon } from "lucide-react";
import { GhostAccordion } from "../../../components/common/Accordion";

interface OrderSummaryItemProps {
  label: string;
  value: string | number;
}

const OrderSummaryItem: React.FC<OrderSummaryItemProps> = ({
  label,
  value,
}) => (
  <div className="flex justify-between py-2 border-b rounded-md border-gray-100 bg-primary-50 p-4">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const OrderConfirmationPage = ({ orderData, setOrderData }) => {
  const { t } = useTranslation();
  const showToast = useToast();
  const { portalsData } = usePortals();
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const paymentChoices = useMemo(
    () => [
      {
        id: "stripe",
        label: t("labels.payNow"),
        icon: <FaCashRegister className="w-6 h-6 text-gray-500" />,
        enabled: true,
      },
      {
        id: "manual",
        label: t("labels.payLater"),
        icon: <FaClock className="w-6 h-6 text-gray-500" />,
        enabled: watch("invoiceSettings.PayLaterOption"),
      },
    ],
    [t, watch]
  );

  const priceQuery = useQuery({
    queryKey: ["priceQuery", watch("portalsCart").map((item) => item.ID)],
    queryFn: () =>
      calculatePrice({
        bundleId: watch("selectedPresetBundle")?.ID || null,
        company: watch("RecieverCompany")?.value,
        bookingType: watch("BookType"),
        productIds: Object.values(portalsData).map((item) => item.ID),
      }),
    select: (res) => res.data,
    enabled: Object.values(portalsData).length > 0,
  });

  return (
    <div className="p-4 flex flex-col">
      <ErrorMessages errors={[errors.PaymentMode?.message]} />
      {/* Order Summary Section */}
      <div className="flex-grow">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          {t("screenNames.orderConfirmation")}
        </h2>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 md:grid-cols-5">
          {/* Left Column - Order Details */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            {/* Amount */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {t("strings.totalPrice")}
              </h3>
              <div className="flex justify-between pb-2 bg-primary-50 p-4">
                <h3>{t("shortStrings.summarizedPrice")}</h3>
                <h3 className="font-semibold text-secondary-600">
                  <NumericFormat
                    decimalScale={3}
                    displayType="text"
                    value={priceQuery?.data?.grossAmount}
                    prefix="€"
                    thousandSeparator
                  />
                </h3>
              </div>
              <div className="flex justify-between pb-2 bg-primary-50 p-4">
                <h3>{t("shortStrings.yourDiscount")}</h3>
                <h3 className="font-semibold text-danger-600">
                  <NumericFormat
                    decimalScale={3}
                    displayType="text"
                    value={`-${priceQuery?.data?.discountAmount || 0}`}
                    prefix="€"
                    thousandSeparator
                  />
                </h3>
              </div>
              <div className="flex justify-between pb-2 bg-primary-50 p-4">
                <h3>{t("shortStrings.tax")}</h3>
                <h3 className="font-semibold text-secondary-600">
                  <NumericFormat
                    decimalScale={3}
                    displayType="text"
                    value={priceQuery?.data?.taxAmount}
                    prefix="€"
                    thousandSeparator
                  />
                </h3>
              </div>
              <hr />
              <div className="flex justify-between pb-2 bg-primary-50 p-4">
                <h3>{t("shortStrings.endPrice")}</h3>
                <h3 className="font-semibold text-success-600">
                  <NumericFormat
                    decimalScale={3}
                    displayType="text"
                    value={priceQuery?.data?.netAmount}
                    prefix="€"
                    thousandSeparator
                  />
                </h3>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">
              {t("shortStrings.orderDetails")}
            </h3>

            <OrderSummaryItem
              label={t("tableTitles.invoiceRecipient")}
              value={watch("RecieverCompany").label}
            />

            <OrderSummaryItem
              label={t("shortStrings.bookingType")}
              value={watch("BookType")}
            />

            {/* Portal List */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {t("shortStrings.selectedProducts")}
              </h3>
              <div className="p-4 space-y-2 bg-gray-50 rounded-md bg-primary-50">
                {Object.values(portalsData).map((portal) => (
                  <div
                    key={portal.ID}
                    className="flex justify-between py-2 border-b border-gray-200 last:border-0"
                  >
                    <span>{portal.ProductName}</span>
                    <span className="font-medium whitespace-nowrap">
                      {portal.Locations.length}
                      {` `}
                      {pluralize(
                        t("labels.locations"),
                        portal.Locations.length
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Payment Selection */}
          <div className="space-y-4 col-span-1 sm:col-span-2 md:col-span-3 relative">
            <div className="flex items-center gap-2">
              {/* {!!watch("PaymentMode") && Object.keys(orderData).length > 0 && ( */}
              {/* {!!watch("PaymentMode") && (
                <button
                  className="flex justify-center items-center"
                  onClick={() => setValue("PaymentMode", null)}
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
              )} */}
              <h3 className="text-lg font-semibold text-gray-700">
                {!watch("PaymentMode") || Object.keys(orderData).length === 0
                  ? t("strings.selectPaymentMethod")
                  : t("strings.completePayment")}
              </h3>
            </div>

            <GhostAccordion
              open={
                !watch("PaymentMode") || Object.keys(orderData).length === 0
              }
            >
              <div className="grid grid-cols-2 gap-4">
                {paymentChoices.map((choice) => (
                  <button
                    key={choice.id}
                    disabled={!choice.enabled}
                    onClick={() => setValue("PaymentMode", choice.id)}
                    className={`
                    p-4 rounded-lg border-2 transition-all
                    flex flex-col items-center justify-center gap-2
                    hover:bg-primary-50 hover:border-primary-300
                    ${
                      watch("PaymentMode") === choice.id
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 bg-white"
                    }
                    ${!choice.enabled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      {choice.icon}
                    </div>
                    <span className="text-sm font-medium">{choice.label}</span>
                  </button>
                ))}
              </div>
            </GhostAccordion>
            {Object.keys(orderData).length > 0 && (
              <PaymentPage setOrderData={setOrderData} {...orderData.data} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
