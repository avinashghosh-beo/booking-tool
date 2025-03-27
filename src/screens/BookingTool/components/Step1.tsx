import React, { useMemo, useState } from "react";
import SelectInput from "../../../components/InputElements/SelectInput";
import TextInput from "../../../components/InputElements/TextInput";
import {
  ButtonComponent,
  SelectButton,
} from "../../../components/common/Button";
import { AddSquareIcon } from "../../../components/icons";
import { useSelector } from "react-redux";
import { CustomDatePicker } from "../../../components/InputElements/DatePicker";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import pluralize from "pluralize";
import ErrorMessages from "../../../components/common/ErrorMessages";

const Step1: React.FC = () => {
  const { t } = useTranslation();
  const durationOptionsMonthly = [
    { value: 1, label: `1 ${pluralize(t("shortStrings.month"), 1)}` },
  ];
  const durationOptionsYearly = [
    { value: 12, label: `12 ${pluralize(t("shortStrings.month"), 12)}` },
    { value: 13, label: `13 ${pluralize(t("shortStrings.month"), 13)}` },
  ];
  const {
    setValue,
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const { allCompanies } = useSelector((state) => state.companies);
  const [durationOptions, setDurationOptions] = useState(durationOptionsYearly);

  const companyOptions = useMemo(() => {
    return allCompanies.map((item) => ({ value: item.id, label: item?.value }));
  }, [allCompanies]);

  const releaseDateOptions = [
    { value: "ASAP", label: t("shortStrings.assoonas") },
    { value: "Date", label: t("shortStrings.customDate") },
  ];

  return (
    <div className="py-4">
      <ErrorMessages errors={[errors.SalaryMonths?.value?.message]} />
      <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2">
        <Controller
          name="RecieverCompany"
          control={control}
          render={({ field }) => (
            <SelectInput
              required
              label={t("shortStrings.whoIsInvoiceReciever")}
              placeholder={t("labels.companyName")}
              errorMessages={[errors.RecieverCompany?.message]}
              options={companyOptions}
              selectedValue={field.value}
              onChange={(props) => {
                setValue("AdvertiserCompany", props);
                field.onChange(props);
              }}
            />
          )}
        />
        <Controller
          name="AdvertiserCompany"
          control={control}
          render={({ field }) => (
            <SelectInput
              required
              label={t("shortStrings.whoIsInvoiceAdvertiser")}
              placeholder={t("labels.companyName")}
              errorMessages={[errors.AdvertiserCompany?.message]}
              options={companyOptions}
              selectedValue={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>
      <div className="flex pb-4 gap-x-2">
        <div className="flex-grow">
          <TextInput
            errorMessages={[errors.CostCenter?.message]}
            required
            label={t("shortStrings.addCostToCenter")}
            placeholder={t("shortStrings.enter")}
            type="text"
            id="CostCenter"
            register={() => register("CostCenter")}
          />
        </div>
        <div className="flex items-end justify-end text-primary-500">
          <ButtonComponent
            colorScheme="default"
            icon={
              <div className="p-1">
                <AddSquareIcon className="size-7 text-primary-500" />
              </div>
            }
            size="sm"
            onClick={() => {}}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2">
        <Controller
          name="ReleaseType"
          control={control}
          render={({ field }) => (
            <SelectInput
              label={t("labels.releaseDate")}
              placeholder={t("labels.releaseDate")}
              errorMessages={[errors.ReleaseType?.message]}
              options={releaseDateOptions}
              selectedValue={field.value}
              onChange={(props) => {
                if (props.value === "Date") {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setValue("ReleaseDate", tomorrow);
                }
                field.onChange(props);
              }}
            />
          )}
        />
        <div className="pt-6">
          {watch("ReleaseType") && watch("ReleaseType")?.value !== "ASAP" && (
            <CustomDatePicker
              date={watch("ReleaseDate") || new Date()}
              onChange={(value) => {
                setValue("ReleaseDate", value);
              }}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-primary">
            <p className="">{t("shortStrings.applicationDeadlineDate")}</p>
            <p className="text-black-500">
              {t("strings.applicationDeadlineDateMessage")}
            </p>
          </label>
          <div className="">
            <CustomDatePicker
              minDate={new Date()}
              onClear={() => setValue("applicationDeadlineDate", null)}
              date={watch("applicationDeadlineDate") || null}
              onChange={(value) => setValue("applicationDeadlineDate", value)}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-primary">
            {t("shortStrings.addSalaryInfo")}
          </label>
          <SelectButton
            selected={watch("SalaryType") === "YEARLY"}
            text={t("shortStrings.yearly")}
            onSelect={() => {
              if (watch("SalaryType") === "YEARLY") {
                setValue("SalaryType", null);
                setValue("SalaryMonths", null);
              } else {
                setValue("SalaryType", "YEARLY");
                setValue("SalaryMonths", durationOptionsYearly[0]);
              }
              setDurationOptions(durationOptionsYearly);
            }}
            style="mt-1"
          />
        </div>
        <div className="flex flex-col justify-end ">
          <SelectButton
            selected={watch("SalaryType") === "MONTHLY"}
            text={t("shortStrings.monthly")}
            onSelect={() => {
              if (watch("SalaryType") === "MONTHLY") {
                setValue("SalaryType", null);
                setValue("SalaryMonths", null);
              } else {
                setValue("SalaryType", "MONTHLY");
                setValue("SalaryMonths", durationOptionsMonthly[0]);
              }
            }}
            style={""}
          />
        </div>
      </div>
      {!!watch("SalaryType") && (
        <div>
          <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-3">
            <div className="mt-1">
              <SelectInput
                placeholder={t("shortStrings.select")}
                errorMessages={[errors.SalaryMonths?.message]}
                showLabel={false}
                id="SalaryMonths"
                options={durationOptions}
                selectedValue={watch("SalaryMonths")}
                onChange={(value) => setValue("SalaryMonths", value)}
              />
            </div>
            <TextInput
              showLabel={false}
              errorMessages={[errors.SalaryFrom?.message]}
              required={!!watch("SalaryType")}
              placeholder={t("shortStrings.from")}
              // type="number"
              id="SalaryFrom"
              register={() => register("SalaryFrom")}
            />
            <TextInput
              showLabel={false}
              errorMessages={[errors.SalaryTo?.message]}
              required={!!watch("SalaryType")}
              placeholder={t("shortStrings.to")}
              // type="number"
              id="SalaryTo"
              register={() => register("SalaryTo")}
            />
          </div>
        </div>
      )}
      <div className="flex pb-4 gap-x-2">
        <div className="flex-grow">
          <div className="">
            <label className="block text-sm font-medium text-primary">
              <p className="">{t("strings.addSpecialIdentifierOptional")}</p>
              <p className="text-black-500">
                {t("strings.addSpecialIdentifierOptionalString")}
              </p>
            </label>
            <TextInput
              errorMessages={[]}
              required={false}
              label=""
              placeholder={t("shortStrings.enter")}
              type="text"
              id="JobReference"
              register={() => register("JobReference")}
            />
          </div>
        </div>
        <div className="flex items-end justify-end text-primary-500">
          <ButtonComponent
            colorScheme="default"
            icon={
              <div className="p-1">
                <AddSquareIcon className="size-7 text-primary-500" />
              </div>
            }
            size="sm"
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default Step1;
