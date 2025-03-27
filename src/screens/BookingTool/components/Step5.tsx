import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import TextInput from "../../../components/InputElements/TextInput";
import { GhostAccordion } from "../../../components/common/Accordion";
import { useTranslation } from "react-i18next";
import ErrorMessages from "../../../components/common/ErrorMessages";
import { Portal } from "./Step4";

const CDN_URL = import.meta.env.VITE_APP_CDN;

const CustomPortalLinkOption = ({
  name,
  icon,
  id,
  setLink,
  link = "",
  urlValid,
}) => {
  const validateUrl = (url: string): boolean => {
    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlPattern.test(url);
  };

  const handleUrlChange = (value: string) => {
    const isValid = validateUrl(value);
    setLink(value, isValid);
  };

  return (
    <div className="grid grid-cols-12 gap-4 pb-4 items-center">
      {/* Logo Column */}
      <div className="col-span-2 flex justify-center">
        <img
          src={CDN_URL + icon}
          alt={name}
          className="h-8 w-auto mix-blend-multiply object-contain"
        />
      </div>
      {/* Input Column */}
      <div className="col-span-10">
        <TextInput
          type="text"
          id={`portal-link-${id}`}
          defaultValue={link}
          onChange={handleUrlChange}
          errorMessages={!urlValid ? ["Please enter a valid URL."] : []}
          register={() => {}}
          placeholder="https://your-career-portal.com/apply"
        />
      </div>
    </div>
  );
};

const Step5 = () => {
  const { t } = useTranslation();
  const {
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext();

  // Keep direct watch calls at the top
  const applicationType = watch("ReciveApplicationType");
  const applicationLinkType = watch("applicationLinkType");
  const selectedPortalsData = watch("selectedPortalsData");

  // Add state to track validation status for each portal
  const [portalValidations, setPortalValidations] = useState({});

  // OPTIMIZE: Create a shared update function for portal data
  const updatePortalData = useCallback(
    (portalId: string, updates: Partial<Portal>) => {
      const portal = selectedPortalsData[portalId];
      if (!portal) return;

      setValue("selectedPortalsData", {
        ...selectedPortalsData,
        [portalId]: { ...portal, ...updates },
      });
    },
    [selectedPortalsData, setValue]
  );

  // Function to update URLs for a specific portal
  const updatePortalUrl = (portalId: string, url: string, isValid: boolean) => {
    updatePortalData(portalId, { ApplicationLinkOrEmail: url });

    let newValidationObject = { ...portalValidations, [portalId]: isValid };
    let validationStatusArray = Object.values(newValidationObject);
    if (
      validationStatusArray.length ===
        Object.keys(selectedPortalsData).length &&
      validationStatusArray.every((value) => value === true)
    )
      setValue("applicationLinksValid", true);
    else setValue("applicationLinksValid", false);
    setPortalValidations(newValidationObject);
  };

  // Handle single URL change
  const handleSingleUrlChange = (value: string) => {
    Object.values(selectedPortalsData).forEach((portal) => {
      const portalId = portal.ID;
      if (portalId) {
        updatePortalUrl(portalId, value, true);
      }
    });
  };

  return (
    <div className="py-4">
      <ErrorMessages
        errors={[
          errors?.ReciveApplicationType?.message,
          errors?.applicationLinksValid?.message,
        ]}
      />
      <div className="pb-4">
        <p className="block text-xl font-medium text-gray-700">
          {t("strings.howShouldApply")}
        </p>
        {/* <div className="flex flex-row items-center justify-center p-2 mt-2 text-xs rounded bg-secondary-100 text-secondary-700 gap-x-2">
          <RadarIcon />
          {t("strings.infoSystemRecognized")}
        </div> */}
      </div>

      <div className="space-y-4">
        {/* Email Option */}
        <div className="flex items-center gap-x-3">
          <input
            type="radio"
            id="emailApplication"
            value="Email"
            {...register("ReciveApplicationType")}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="emailApplication" className="text-gray-700">
            {t("strings.receiveInEmail")}
          </label>
        </div>

        <GhostAccordion open={applicationType === "Email"}>
          <TextInput
            errorMessages={
              errors.ApplicationLinkOrEmail?.message
                ? [errors.ApplicationLinkOrEmail.message]
                : []
            }
            placeholder={t("shortStrings.enterAnEmail")}
            type="Email"
            id="ApplicationLinkOrEmail"
            register={() => register("ApplicationLinkOrEmail")}
          />
        </GhostAccordion>

        {/* Link Option */}
        <div className="flex items-center gap-x-3">
          <input
            type="radio"
            id="linkApplication"
            value="Link"
            {...register("ReciveApplicationType")}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="linkApplication" className="text-gray-700">
            {t("strings.receiveInLink")}
          </label>
        </div>

        <GhostAccordion open={applicationType === "Link"}>
          <div className="space-y-4 p-4">
            <h3 className="text-lg font-medium text-gray-700">
              {t("strings.needSeparateUrls")}
            </h3>

            {/* Single URL Option */}
            <div className="flex items-center gap-x-3">
              <input
                type="radio"
                id="singleUrl"
                value="single"
                {...register("applicationLinkType")}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="singleUrl" className="text-gray-700">
                {t("shortStrings.no")}
              </label>
            </div>

            <GhostAccordion open={applicationLinkType === "single"}>
              <TextInput
                errorMessages={
                  errors.applicationLinkUrl?.message
                    ? [errors.applicationLinkUrl.message]
                    : []
                }
                placeholder={t("shortStrings.enterAUrl")}
                type="url"
                id="applicationLinkUrl"
                register={() => register("applicationLinkUrl")}
                onChange={handleSingleUrlChange}
              />
            </GhostAccordion>

            {/* Separate URLs Option */}
            <div className="flex items-center gap-x-3">
              <input
                type="radio"
                id="separateUrls"
                value="separate"
                {...register("applicationLinkType")}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="separateUrls" className="text-gray-700">
                {t("shortStrings.yes")}
              </label>
            </div>

            <GhostAccordion open={applicationLinkType === "separate"}>
              {Object.values(selectedPortalsData).map((item) => {
                const portalId = item.ID;
                return (
                  <CustomPortalLinkOption
                    key={portalId}
                    name={item.ProductName}
                    icon={item.LogoName}
                    id={portalId}
                    urlValid={
                      Object.keys(portalValidations).includes(portalId)
                        ? portalValidations[portalId]
                        : true
                    }
                    setLink={(value, isValid) =>
                      updatePortalUrl(portalId, value, isValid)
                    }
                    link={item.ApplicationLinkOrEmail}
                  />
                );
              })}
            </GhostAccordion>
          </div>
        </GhostAccordion>
      </div>
    </div>
  );
};

export default Step5;
