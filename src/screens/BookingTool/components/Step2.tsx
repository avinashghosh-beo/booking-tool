import React, { useLayoutEffect } from "react";
import { SelectButton } from "../../../components/common/Button";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import ChooseFromContingents from "./ChooseFromContingents";
import ChoosePresetBundle from "./ChoosePresetBundle";
import BuildYourOwnBundle from "./BuildYourOwnBundle";
import { useSearchParams } from "react-router-dom";
import ErrorMessages from "../../../components/common/ErrorMessages";

const Step2: React.FC = () => {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const {
    setValue,  
    watch,
    formState: { errors },
  } = useFormContext();

  useLayoutEffect(() => {
    if (params.get("contingentID")) setValue("BookType", "Contingent");
  }, [params]);

  return (
    <div className="py-4">
      <ErrorMessages
        errors={[
          errors?.BookType?.message,
          errors?.selectedPresetBundle?.message,
          errors?.productCatagory?.message,
          errors?.portalsCart?.message,
          errors?.selectedContingent?.message,
        ]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SelectButton
          selected={watch("BookType") === "Bundle"}
          text={t("labels.choosePresetBundle")}
          onSelect={() => {
            setValue("BookType", "Bundle");
            setValue("portalsCart", []);
          }}
          style="mt-1"
        />
        <SelectButton
          selected={watch("BookType") === "Custom"}
          text={t("labels.buildYourOwnBundle")}
          onSelect={() => {
            setValue("BookType", "Custom");
            setValue("selectedPresetBundle", {});
          }}
          style="mt-1"
        />
        <SelectButton
          selected={watch("BookType") === "Contingent"}
          text={t("labels.chooseFromContingents")}
          onSelect={() => {
            setValue("BookType", "Contingent");
            setValue("selectedPresetBundle", {});
          }}
          style="mt-1"
        />
      </div>
      {
        // Elements for bundle selection mode === choose
        watch("BookType") === "Bundle" && <ChoosePresetBundle />
      }
      {
        // Elements for bundle selection mode === custom
        watch("BookType") === "Custom" && <BuildYourOwnBundle />
      }
      {
        // Elements for bundle selection mode === contingent
        watch("BookType") === "Contingent" && <ChooseFromContingents />
      }
    </div>
  );
};

export default Step2;
