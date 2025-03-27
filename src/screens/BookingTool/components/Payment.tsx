import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { ButtonComponent } from "../../../components/common/Button";
import useToast from "../../../hooks/useToast";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK); // Replace with your Stripe public key

function PaymentForm({
  clientSecret,
  orderId,
  paymentReference,
  setOrderData,
}) {
  const { t } = useTranslation();
  const showToast = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { watch, setValue } = useFormContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error(t("strings.stripeNotLoaded"));
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        payment_method_data: {
          metadata: {
            order_id: orderId,
            payment_reference: paymentReference,
          },
        },
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        throw error;
      }

      showToast(t("successMessages.paymentSuccessful"), {
        position: "top-right",
        hideProgressBar: true,
      });
    } catch (error) {
      console.error(t("errorMessages.paymentError"), error);
      showToast(error.message || t("errorMessages.paymentFailed"), {
        position: "top-right",
        hideProgressBar: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {t("strings.paymentReference")}: {paymentReference}
        </p>
      </div>

      <PaymentElement />
      <div className="w-full grid grid-cols-2 gap-4">
        <ButtonComponent
          onClick={() => {
            setValue("PaymentMode", null);
            setOrderData({});
          }}
          textStyle="font-medium text-md"
          title={t("buttonLabels.back")}
          size="md"
          type="button"
          colorScheme="default"
        />
        <ButtonComponent
          textStyle="font-medium text-md"
          loading={isProcessing}
          disabled={!stripe || !elements}
          title={t("labels.payNow")}
          size="md"
          colorScheme="primary"
          type="submit"
        />
      </div>
    </form>
  );
}

export default function PaymentPage({
  clientSecret,
  orderId,
  paymentReference,
  paymentIntentId,
  setOrderData,
}) {
  const { t } = useTranslation();
  if (!clientSecret) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">{t("strings.loadingPaymentDetails")}</p>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#0066cc",
          },
        },
      }}
    >
      <PaymentForm
        setOrderData={setOrderData}
        clientSecret={clientSecret}
        orderId={orderId}
        paymentReference={paymentReference}
      />
    </Elements>
  );
}
