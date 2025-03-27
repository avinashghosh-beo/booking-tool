import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ButtonComponent } from "../../components/common/Button";
import { useQuery } from "@tanstack/react-query";
import { validatePayment } from "./api";
import Spinner from "../../components/common/Spinner";
import { useTranslation } from "react-i18next";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Extract parameters from the URL
  const paymentIntent = searchParams.get("payment_intent");
  const clientSecret = searchParams.get("payment_intent_client_secret");
  const redirectStatus = searchParams.get("redirect_status");

  const { isLoading, isSuccess, isError, error } = useQuery({
    queryFn: () =>
      validatePayment({
        payment_intent: paymentIntent,
        payment_intent_client_secret: clientSecret,
        redirect_status: redirectStatus,
      }),
  });

  return (
    <div className="h-full p-4 overflow-auto bg-white rounded-xl">
      {isLoading && (
        <div className="flex flex-row items-center gap-x-4">
          <Spinner />
          <h2 className="text-2xl font-bold text-green-600">
            {t("strings.verifyingOrder")}
          </h2>
        </div>
      )}
      {isSuccess && (
        <>
          <h2 className="text-2xl font-bold text-green-600">
            {t("strings.paymentSuccess")}
          </h2>
          <p className="mt-2 text-gray-700">
            {t("strings.paymentSuccessMessage")}
          </p>
        </>
      )}
      {isError && (
        <>
          <h2 className="text-2xl font-bold text-green-600">
            {t("errorMessages.error")}
          </h2>
          <p className="mt-2 text-gray-700">{t("strings.contactSupport")}</p>
        </>
      )}

      {isError && (
        <div className="p-4 mt-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-bold text-green-600">
            {t("strings.errorDetails")}
          </h2>
          <p className="mt-2 text-gray-700">
            {error?.response?.data?.data?.errorCode}
          </p>
          <p className="mt-2 text-gray-700">
            {error?.response?.data?.data?.errorMessage}
          </p>
        </div>
      )}
      {/* Display extracted parameters */}
      {isSuccess && (
        <div className="p-4 mt-4 bg-gray-100 rounded-lg">
          <p>
            <strong>{t("strings.paymentIntentLabel")}</strong> {paymentIntent}
          </p>
          <p>
            <strong>{t("strings.clientSecretLabel")}</strong> {clientSecret}
          </p>
          <p>
            <strong>{t("strings.redirectStatusLabel")}</strong> {redirectStatus}
          </p>
        </div>
      )}
      {!isLoading && (
        <div className="pt-4">
          <ButtonComponent
            size="sm"
            colorScheme="primary"
            onClick={() => navigate("/")}
            title={t("buttonLabels.goBackToHome")}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
