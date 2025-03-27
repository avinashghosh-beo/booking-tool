import React from "react";
import DataTable from "../../../components/tables";
import { SelectButton } from "../../../components/common/Button";
import UploadAdDetails from "./UploadAdDetails";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { TickCircleIcon } from "../../../components/icons";
import ErrorMessages from "../../../components/common/ErrorMessages";

export const SelectActionButton = ({ data }) => {
  const { setValue, watch } = useFormContext();

  let itemId = data?.ID || data?._id;
  let alreadySelectedId =
    watch("copyContentsFromAd")?.ID || watch("copyContentsFromAd")?._id;

  return (
    <div
      onClick={() => {
        setValue("copyContentsFromAd", data);
      }}
      size={16}
      className={
        alreadySelectedId === itemId
          ? "text-primary-500 ml-2"
          : "text-primary-300 ml-2"
      }
    >
      <TickCircleIcon />
    </div>
  );
};

const Step3 = () => {
  const { t } = useTranslation();
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const components = {
    WorkBench: (
      <DataTable
        showPagination
        name="workbenchJobAds"
        params={{ company: [watch("AdvertiserCompany").value] }}
      />
    ),
    AlreadyPublished: (
      <DataTable
        showPagination
        name="alreadyPublishedAds"
        params={{ company: [watch("AdvertiserCompany").value] }}
      />
    ),
    FileUpload: <UploadAdDetails />,
  };

  return (
    <div className="py-4">
      <ErrorMessages
        errors={[
          errors?.copyContentsFromAd?.message,
          errors?.adDetailsLink?.message,
          errors?.publishAdChoice?.message,
        ]}
      />
      <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-3">
        <SelectButton
          iconPosition="left"
          selected={watch("JobAdType") === "WorkBench"}
          text={t("shortStrings.workbench")}
          onSelect={() => {
            setValue("JobAdType", "WorkBench");
          }}
          style="mt-1"
        />
        <SelectButton
          selected={watch("JobAdType") === "AlreadyPublished"}
          text={t("shortStrings.alreadyPublishedAds")}
          onSelect={() => {
            setValue("JobAdType", "AlreadyPublished");
          }}
          style="mt-1"
        />
        <SelectButton
          selected={watch("JobAdType") === "FileUpload"}
          text={t("shortStrings.uploadYourAd")}
          onSelect={() => {
            setValue("JobAdType", "FileUpload");
          }}
          style="mt-1"
        />
      </div>
      {components[watch("JobAdType")]}
    </div>
  );
};
export default Step3;
