import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { postRequest } from "../../api";
import { ENDPOINTS } from "../../api/endpoints";
import NoAuthSidebar from "../../components/common/NoAuthSidebar";
import { useAuth } from "../../contexts/AuthContext";
import logoInverted from "../../assets/Icons/logoInverted.svg";
import { useForm } from "react-hook-form";
import { LoginButton } from "../../components/common/Button";
import TextInput from "../../components/InputElements/TextInput";
import { Forbidden2Icon } from "../../components/icons";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [customErrorMessage, setCustomErrorMessage] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: { email: string; password: string }) => {
    setLoading(true);
    postRequest(ENDPOINTS.login, {
      email: data.email,
      password: data.password,
      info: "undefined",
    })
      .then((res) => {
        if (res.status) { 
          login(res.data);
          navigate("/");
        }
      })
      .catch((err) => {
        setCustomErrorMessage(
          err?.response?.data?.customMessage ||
            "Something went wrong, Please try again later."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className="flex min-h-screen bg-primary-900"
      aria-label={t("ariaLabels.loginPage")}
    >
      {/* Left Sidebar */}
      <NoAuthSidebar />
      {/* Login Form */}
      <div className="flex flex-col items-center justify-center w-full gap-4 p-4 md:w-full bg-primary-50 md:rounded-l-3xl">
        <img
          src={logoInverted}
          alt={t("ariaLabels.personalturmLogo")}
          className="block max-w-64 md:hidden"
        />

        <div className="w-full max-w-lg px-6 py-8 space-y-8 bg-white border-primary-200 rounded-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-primary-800">
              {t("shortStrings.loginHead")}
            </h2>
          </div>
          <form
            aria-label={t("ariaLabels.loginForm")}
            className="space-y-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
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
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: t("errorMessages.emailInvalid"),
                    },
                  })
                }
              />
              <TextInput
                errorMessages={[errors.password?.message]}
                required
                label={t("labels.password")}
                placeholder={t("labels.password")}
                type="password"
                id="password"
                register={() =>
                  register("password", {
                    required: t("errorMessages.passwordRequired"),
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
            <div className="flex items-center justify-end">
              <Link
                aria-label={t("ariaLabels.forgotPasswordPage")}
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                {t("screenNames.forgotPassword")}
              </Link>
            </div>
            <LoginButton
              loading={loading}
              onClick={() => {}} // handled by form action
              title={t("buttonLabels.login")}
            />
          </form>
        </div>

        <p className="mt-4 text-sm text-center">
          {t("embeddedStrings.notRegistered")
            .split("<span>")
            .map((part, index) => {
              if (index === 1) {
                return (
                  <Fragment key={index}>
                    <span
                      aria-label={t("ariaLabels.registerPage")}
                      key={index}
                      className="cursor-pointer text-primary-600 hover:text-primary-700"
                      onClick={() => navigate("/register")}
                    >
                      {part.split("</span>")[0]}
                    </span>
                    {part.split("</span>")[1]}
                  </Fragment>
                );
              }
              return part;
            })}
        </p>
      </div>
    </div>
  );
}
