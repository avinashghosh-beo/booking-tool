import React, { useEffect, useState } from "react";
import { ButtonComponent } from "../../components/common/Button";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import Step5 from "./components/Step5";
import ProgressBar from "../../components/common/ProgressBar";
import { FormProvider, useForm } from "react-hook-form";
import ConfirmationModal from "../../components/modals/Confirmation";
import { zodResolver } from "@hookform/resolvers/zod";
import { getStepSchema, getFinalValidation } from "./ValidationSchemas";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { OrderAd } from "./api";
import useToast from "../../hooks/useToast";
import { submitDataResolver } from "./dataResolver";
import { PortalProvider } from "../../contexts/PortalContext";
import OrderConfirmationPage from "./components/OrderConfirmationPage";
import { useNavigate } from "react-router-dom";

const totalSteps = 5;
const FORM_STORAGE_KEY = "bookingToolForm";

const BookingTool = () => {
  const { t } = useTranslation();
  const showToast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [loadSaved, setLoadSaved] = useState(false);
  const [savedData, setSavedData] = useState(null);
  const [orderData, setOrderData] = useState({});
  const [isFormsComplete, setIsFormsComplete] = useState(false);

  // Default form values
  const defaultFormValues = {
    // AdvertiserCompany: { value: "", label: "" },
    // RecieverCompany: { value: "", label: "" },
    portalsCart: [],
    presetBundleCatagory: {},
    copyContentsFromAd: "",
    adDetailsLink: "",
    publishAdChoice: "",
    ReciveApplicationType: "Email",
    applicationLinkType: "single",
    SalaryType: "",
    currentCartItemType: "paid",
    ReleaseType: { value: "ASAP", label: t("shortStrings.assoonas") },
    productCatagory: { ID: "ALL" },
  };

  // Check if saved data exists
  useEffect(() => {
    const storedData = localStorage.getItem(FORM_STORAGE_KEY);
    if (storedData && Object.keys(orderData).length < 1) {
      setSavedData(JSON.parse(storedData)); // Store parsed data
      setShowModal(true);
    }
  }, []);

  const form = useForm({
    resolver: isFormsComplete
      ? zodResolver(getFinalValidation())
      : zodResolver(getStepSchema(step)),
    mode: "onChange",
    defaultValues: defaultFormValues,
  });

  // Reset form when `loadSaved` updates
  useEffect(() => {
    if (loadSaved && savedData) {
      form.reset(savedData);
    }
  }, [loadSaved, savedData, form]);

  // Auto-save form data on change
  useEffect(() => {
    const subscription = form.watch((values) => {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(values));
    });

    return () => subscription.unsubscribe();
  }, [form.watch]);

  const handleNext = async () => {
    const isValid = await form.trigger(); // Manually trigger validation

    if (!isValid) {
      console.log(
        "Form validation failed. Check errors:",
        form.formState.errors
      );
      return; // Stop here if form is invalid
    }

    if (isFormsComplete) {
      form.handleSubmit(onSubmit)();
    } else if (step === totalSteps) {
      if (form.watch("BookType") === "Contingent") {
        form.handleSubmit(onSubmit)();
      } else {
        if (
          form.watch("BookType") === "Custom" &&
          form.watch("currentCartItemType") === "Free"
        )
          form.handleSubmit(onSubmit)();
        else setIsFormsComplete(true);
      }
    } else setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (isFormsComplete) {
      setIsFormsComplete(false);
    } else if (step > 1) setStep((prev) => prev - 1);
  };

  const getNextButtonTitle = () => {
    if (step === totalSteps) {
      if (form.watch("BookType") === "Contingent") {
        return t("buttonLabels.completeBooking");
      } else {
        if (
          form.watch("BookType") === "Custom" &&
          form.watch("currentCartItemType") === "Free"
        )
          return t("buttonLabels.completeBooking");
        else return t("shortStrings.continueToPayment");
      }
    } else return t("buttonLabels.next");
  };

  const submitMutation = useMutation({
    mutationFn: OrderAd,
    onSuccess: (res) => {
      localStorage.removeItem(FORM_STORAGE_KEY);
      if (res?.data?.data) {
        let message = res.data.data?.message || "Order completed successfully";
        let orderId = res.data.data?.orderId || "ORD123456";
        let reference = res.data.data?.paymentReference || "PAY789012";
        let paymentMode = res.data.type || "manual";

        const redirectUrl = `/order-success?message=${message}&orderId=${orderId}&paymentReference=${reference}&paymentMode=${paymentMode}`;

        if (form.watch("BookType") === "Contingent") {
          navigate(redirectUrl);
        } else {
          if (
            form.watch("BookType") === "Custom" &&
            form.watch("currentCartItemType") === "Free"
          )
            navigate(redirectUrl);
        }
      }
    },
    onError: (err) => {
      if (err.response) {
        showToast(err.response?.data?.data?.errorMessage, {
          position: "top-right",
          hideProgressBar: true,
        });
      }
    },
  });

  const onSubmit = () => {
    submitMutation.mutate(submitDataResolver(form.getValues()));
    localStorage.removeItem(FORM_STORAGE_KEY); // Clear saved form data
  };

  const handleRestoreData = () => {
    setLoadSaved(true);
    setShowModal(false);
  };

  const handleStartFresh = () => {
    localStorage.removeItem(FORM_STORAGE_KEY);
    setLoadSaved(false);
    setShowModal(false);
  };

  const forms = {
    1: { title: t("screenNames.step1"), component: <Step1 /> },
    2: { title: t("screenNames.step2"), component: <Step2 /> },
    3: { title: t("screenNames.step3"), component: <Step3 /> },
    4: { title: t("screenNames.step4"), component: <Step4 /> },
    5: { title: t("screenNames.step5"), component: <Step5 /> },
  };

  return (
    <>
      {/* Restore Data Modal */}
      <ConfirmationModal
        type="confirm"
        visible={showModal}
        title={t("warningMessages.resturePreviousData")}
        text={t("warningMessages.doYouWantToContinue")}
        onClose={handleStartFresh}
        onConfirm={handleRestoreData}
      />

      {/* Booking Form */}
      <div className="flex flex-col items-center justify-center flex-grow h-full">
        <div className="flex flex-col w-full h-full p-3 bg-white rounded-lg">
          <div className="flex-grow overflow-hidden overflow-y-auto md:pr-4 p-2">
            {!isFormsComplete && (
              <div className="pb-4">
                <div className="flex justify-between">
                  <h2 className="text-lg font-medium">
                    {t("shortStrings.step")} {forms[step]?.title}
                  </h2>
                  <div className="mb-4 text-end text-black-500">
                    <span className="text-primary-500">
                      {t("shortStrings.step")} {step}{" "}
                    </span>{" "}
                    of {totalSteps}
                  </div>{" "}
                </div>
                <ProgressBar step={step} totalSteps={totalSteps} />
              </div>
            )}
            <FormProvider {...form}>
              <PortalProvider>
                {isFormsComplete ? (
                  <OrderConfirmationPage
                    setOrderData={setOrderData}
                    orderData={orderData}
                  />
                ) : (
                  forms[step]?.component
                )}
              </PortalProvider>
            </FormProvider>
          </div>
          {Object.keys(orderData).length < 1 ? (
            <div
              className="flex justify-end pt-4 pb-20 sm:pb-0"
              style={{ boxShadow: "0 -8px 20px rgba(255, 255, 255, 1)" }}
            >
              <div className="grid grid-cols-2 gap-4 place-content-end min-w-64">
                {/* {isFormsComplete && <div></div>} */}

                {step > 1 ? (
                  <ButtonComponent
                    colorScheme="light"
                    size="md"
                    title={t("buttonLabels.back")}
                    onClick={handleBack}
                  />
                ) : (
                  <div />
                )}
                {/* {!isFormsComplete && (
                  <ButtonComponent
                    loading={submitMutation.isLoading}
                    colorScheme="primary"
                    size="md"
                    // disabled={!form.formState.isValid}
                    title={getNextButtonTitle()}
                    onClick={handleNext}
                  />
                )} */}
                <ButtonComponent
                  loading={submitMutation.isLoading}
                  colorScheme="primary"
                  size="md"
                  // disabled={!form.formState.isValid}
                  title={getNextButtonTitle()}
                  onClick={handleNext}
                />
              </div>
            </div>
          ) : (
            <div
              className="flex justify-end pt-4 pb-20 sm:pb-0"
              style={{ boxShadow: "0 -8px 20px rgba(255, 255, 255, 1)" }}
            ></div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingTool;
