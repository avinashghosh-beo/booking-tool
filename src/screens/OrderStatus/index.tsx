import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ButtonComponent } from "../../components/common/Button";
import { useTranslation } from "react-i18next";
import { TickCircle } from "../../components/icons";

const OrderStatus = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const message =
    searchParams.get("message") || t("strings.successfullyBooked");
  const orderId = searchParams.get("orderId") || "N/A";
  const paymentReference = searchParams.get("paymentReference") || "N/A";
  const paymentMode = searchParams.get("paymentMode") || "manual";

  return (
    <div className="h-full p-4 overflow-auto bg-white rounded-xl flex justify-center items-center">
      <div className="py-12 px-24 mt-4 bg-primary-50 rounded-lg flex flex-col justify-center items-center">
        <TickCircle className="w-16 h-16 text-green-600" />
        <h2 className="text-xl font-semibold">{t("strings.orderConfirmed")}</h2>
        <h4 className="text-sm">
          {t("embeddedStrings.orderCreatedWithPayment", { paymentMode })}
        </h4>
        <div className="flex flex-col gap-1 justify-center items-center mt-3 bg-white rounded-lg border-dotted border-gray-300 border-2 px-20 py-2">
          {/* <p className="text-gray-700">{message}</p> */}
          <p className="text-gray-700">{t("strings.orderSummary")}</p>
          <p>
            {t("embeddedStrings.orderIdWithValue", { orderId })}
          </p>
          <p>
            {t("embeddedStrings.paymentReferenceWithValue", { reference: paymentReference })}
          </p>
        </div>
        <div className="pt-4">
          <ButtonComponent
            size="sm"
            colorScheme="primary"
            onClick={() => navigate("/")}
            title={t("buttonLabels.goBackToHome")}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
