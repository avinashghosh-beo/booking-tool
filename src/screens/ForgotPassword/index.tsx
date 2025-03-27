import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import NoAuthSidebar from "../../components/common/NoAuthSidebar";
import { LoginButton } from "../../components/common/Button";
import TextInput from "../../components/InputElements/TextInput";
import { Forbidden2Icon } from "../../components/icons";
import logoInverted from "../../assets/Icons/logoInverted.svg";
import { useForm } from "react-hook-form";
import { postRequest } from "../../api";
import { ENDPOINTS } from "../../api/endpoints";
import useToast from "../../hooks/useToast";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [customErrorMessage, setCustomErrorMessage] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Step 1: Handle email submission
  const handleEmailSubmit = (data: { email: string }) => {
    setLoading(true);
    postRequest(ENDPOINTS.forgotPassword, { email: data.email })
      .then((res) => {
        if (res.status) {
          setEmail(data.email);
          setStep(2);
        }
      })
      .catch((err) => {
        setCustomErrorMessage(
          err?.response?.data?.customMessage || t("errorMessages.emailInvalid")
        );
      })
      .finally(() => setLoading(false));
  };

  // Step 2: Handle OTP verification
  const handleOTPSubmit = (data: { otp: string }) => {
    setLoading(true);
    postRequest(ENDPOINTS.verifyOtp, { email, otp: data.otp })
      .then((res) => {
        if (res.status) {
          setStep(3);
        }
      })
      .catch((err) => {
        setCustomErrorMessage(
          err?.response?.data?.customMessage || t("errorMessages.otpInvalid")
        );
      })
      .finally(() => setLoading(false));
  };

  // Step 3: Handle new password submission
  const handlePasswordSubmit = (data: { password: string }) => {
    setLoading(true);
    postRequest(ENDPOINTS.resetPassword, { email, password: data.password })
      .then((res) => {
        if (res.success) {
          navigate("/login");
        }
      })
      .catch((err) => {
        setCustomErrorMessage(
          err?.response?.data?.data?.errorMessage ||
            t("errorMessages.somethingWentWrong")
        );
      })
      .finally(() => setLoading(false));
  };

  const showToast = useToast();

  useLayoutEffect(() => {
    showToast("This is a custom plain toast!", {
      position: "top-right",
      hideProgressBar: true,
    });
  }, []);

  return (
    <div
      aria-label={t("ariaLabels.forgotPasswordPage")}
      className="flex min-h-screen bg-primary-900"
    >
      {/* Left Sidebar */}
      <NoAuthSidebar />

      {/* Forgot Password Form */}
      <div className="flex flex-col items-center justify-center w-full gap-4 p-4 md:w-full bg-primary-50 md:rounded-l-3xl">
        <img
          src={logoInverted}
          alt="Logo"
          className="block max-w-64 md:hidden"
        />
        <div className="w-full max-w-md p-8 space-y-8 bg-background rounded-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-primary-800">
              {step === 1
                ? t("screenNames.forgotPassword")
                : step === 2
                ? t("labels.enterOTP")
                : t("labels.enterNewPassword")}
            </h2>
          </div>

          {step === 1 && (
            <form
              aria-label={t("ariaLabels.forgotPasswordForm")}
              className="space-y-2"
              onSubmit={handleSubmit(handleEmailSubmit)}
            >
              <div className="mb-4 space-y-4">
                <TextInput
                  errorMessages={[errors.email?.message]}
                  required
                  label={t("labels.email")}
                  placeholder={t("labels.email")}
                  type="email"
                  id="email"
                  register={() =>
                    register("email", {
                      required: t("errorMessages.emailRequired"),
                      pattern: {
                        value:
                          /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                        message: t("errorMessages.emailInvalid"),
                      },
                    })
                  }
                />
              </div>
              {customErrorMessage && (
                <div className="flex gap-2 mt-2 text-sm text-danger-600">
                  <Forbidden2Icon />
                  {customErrorMessage}
                </div>
              )}
              <LoginButton
                onClick={() => {}}
                loading={loading}
                title={t("buttonLabels.sendOTP")}
              />
            </form>
          )}

          {step === 2 && (
            <form
              aria-label={t("ariaLabels.forgotPasswordForm")}
              className="space-y-2"
              onSubmit={handleSubmit(handleOTPSubmit)}
            >
              <div className="mb-4 space-y-4">
                <TextInput
                  errorMessages={[errors.otp?.message]}
                  required
                  label={t("labels.otp")}
                  placeholder={t("labels.otp")}
                  type="text"
                  id="otp"
                  register={() =>
                    register("otp", {
                      required: t("errorMessages.otpRequired"),
                    })
                  }
                />
              </div>
              {customErrorMessage && (
                <div className="flex gap-2 mt-2 text-sm text-danger-600">
                  <Forbidden2Icon />
                  {customErrorMessage}
                </div>
              )}
              <LoginButton
                onClick={() => {}}
                loading={loading}
                title={t("buttonLabels.verifyOTP")}
              />
            </form>
          )}

          {step === 3 && (
            <form
              aria-label={t("ariaLabels.forgotPasswordForm")}
              className="space-y-2"
              onSubmit={handleSubmit(handlePasswordSubmit)}
            >
              <div className="mb-4 space-y-4">
                <TextInput
                  errorMessages={[errors.password?.message]}
                  required
                  label={t("labels.newPassword")}
                  placeholder={t("labels.newPassword")}
                  type="password"
                  id="password"
                  register={() =>
                    register("password", {
                      required: t("errorMessages.passwordRequired"),
                      minLength: {
                        value: 8,
                        message: t("errorMessages.passwordMinLength"),
                      },
                    })
                  }
                />
              </div>
              {customErrorMessage && (
                <div className="flex gap-2 mt-2 text-sm text-danger-600">
                  <Forbidden2Icon />
                  {customErrorMessage}
                </div>
              )}
              <LoginButton
                onClick={() => {}}
                loading={loading}
                title={t("buttonLabels.resetPassword")}
              />
            </form>
          )}
        </div>
        <p className="max-w-lg mt-4 text-sm text-center">
          {t("embeddedStrings.alreadyRegistered")
            .split("<span>")
            .map((part, index) => {
              if (index === 1) {
                return (
                  <>
                    <span
                      aria-label={t("ariaLabels.loginPage")}
                      key={index}
                      className="cursor-pointer text-primary-600"
                      onClick={() => navigate("/login")}
                    >
                      {part.split("</span>")[0]}
                    </span>
                    {part.split("</span>")[1]}
                  </>
                );
              }
              return part;
            })}
        </p>
      </div>
    </div>
  );
}
