//UI_COMPONENTS
import React, { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import NoAuthSidebar from "../../components/common/NoAuthSidebar";
import { LoginButton } from "../../components/common/Button";
import logoInverted from "../../assets/Icons/logoInverted.svg";
import TextInput from "../../components/InputElements/TextInput";
import SelectInput from "../../components/InputElements/SelectInput";

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState({
    value: "Female",
    label: t("labels.female"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    console.log("Submit");
  };

  const options = [
    { value: "Female", label: t("labels.female") },
    { value: "Male", label: t("labels.male") },
    { value: "Others", label: t("labels.others") },
  ];

  return (
    <div
      aria-label={t("ariaLabels.registerPage")}
      className="flex h-screen min-h-screen bg-primary-900"
    >
      {/* Left Sidebar */}
      <NoAuthSidebar />
      {/* Login Form */}
      <div className="grid w-full gap-4 p-12 overflow-hidden overflow-y-auto place-items-center md:w-full bg-primary-50 md:rounded-l-3xl">
        <img
          src={logoInverted}
          alt="Logo"
          className="block max-w-64 md:hidden"
        />

        <div className="w-full max-w-lg">
          <div className="w-full max-w-lg px-6 py-8 bg-white border-primary-200 rounded-2xl">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-primary-800">
                {t("buttonLabels.addNewCompany")}
              </h2>
            </div>

            <form
              aria-label={t("ariaLabels.registrationForm")}
              className="mt-8 space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="space-y-4">
                <TextInput
                  errorMessages={[errors.companyName?.message]}
                  required
                  label={t("labels.companyName")}
                  placeholder={t("labels.companyName")}
                  type="text"
                  id="companyName"
                  register={() =>
                    register("companyName", {
                      required: t("errorMessages.companyNameRequired"),
                    })
                  }
                />
                <TextInput
                  errorMessages={[errors.street?.message]}
                  required
                  label={t("labels.street")}
                  placeholder={t("labels.street")}
                  type="text"
                  id="street"
                  register={() =>
                    register("street", {
                      required: t("errorMessages.streetRequired"),
                    })
                  }
                />

                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="w-full">
                    <TextInput
                      errorMessages={[errors.houseNumber?.message]}
                      required
                      label={t("labels.houseNumber")}
                      placeholder={t("labels.houseNumber")}
                      type="text"
                      id="houseNumber"
                      register={() =>
                        register("houseNumber", {
                          required: t("errorMessages.houseNumberRequired"),
                        })
                      }
                    />
                  </div>
                  <div className="w-full">
                    <TextInput
                      errorMessages={[errors.postalCode?.message]}
                      required
                      label={t("labels.postalCode")}
                      placeholder={t("labels.postalCode")}
                      type="number"
                      id="postalCode"
                      register={() =>
                        register("postalCode", {
                          required: t("errorMessages.postalCodeRequired"),
                        })
                      }
                    />
                  </div>
                </div>

                <SelectInput
                  required
                  errorMessages={[]}
                  label={t("labels.gender")}
                  placeholder={t("labels.gender")}
                  id="gender"
                  options={options}
                  selectedValue={gender}
                  onChange={setGender}
                />

                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="w-full">
                    <TextInput
                      errorMessages={[errors.firstName?.message]}
                      required
                      label={t("labels.firstName")}
                      placeholder={t("labels.firstName")}
                      type="text"
                      id="firstName"
                      register={() =>
                        register("firstName", {
                          required: t("errorMessages.firstnameRequired"),
                        })
                      }
                    />
                  </div>
                  <div className="w-full">
                    <TextInput
                      errorMessages={[errors.lastName?.message]}
                      required
                      label={t("labels.lastName")}
                      placeholder={t("labels.lastName")}
                      type="text"
                      id="lastName"
                      register={() =>
                        register("lastName", {
                          required: t("errorMessages.lastnameRequired"),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="w-full">
                    <TextInput
                      errorMessages={[errors.contactEmail?.message]}
                      required
                      label={t("labels.contactEmail")}
                      placeholder={t("labels.contactEmail")}
                      type="text"
                      id="contactEmail"
                      register={() =>
                        register("contactEmail", {
                          required: t("errorMessages.contactEmailRequired"),
                        })
                      }
                    />
                  </div>
                  <div className="w-full">
                    <TextInput
                      errorMessages={[errors.telephoneNumber?.message]}
                      required
                      label={t("labels.telephoneNumber")}
                      placeholder={t("labels.telephoneNumber")}
                      type="text"
                      id="telephoneNumber"
                      register={() =>
                        register("telephoneNumber", {
                          required: t("errorMessages.contactTelRequired"),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <LoginButton
                loading={loading}
                onClick={() => {}}
                title={t("buttonLabels.register")}
              />
            </form>
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
    </div>
  );
}
