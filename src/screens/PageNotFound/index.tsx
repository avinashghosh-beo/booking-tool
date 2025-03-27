import React from "react";
import { ButtonComponent } from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { PersonaltrumBgOverlay } from "../../components/icons";
import { useTranslation } from "react-i18next";

const PageNotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative flex items-center w-full h-full p-4 sm:p-10">
      <div className="z-50 p-4 bg-white bg-opacity-50 rounded-md shadow-md sm:shadow-none">
        <div className="text-3xl text-primary-500">{t("strings.oops")}</div>
        <div className="text-5xl text-primary-800">
          {t("strings.pageNotFound")}
        </div>
        <div className="py-2 w-fit">
          <ButtonComponent
            size="md"
            colorScheme="light"
            title={t("buttonLabels.goBack")}
            onClick={() => navigate(-1)}
          />
        </div>
      </div>
      <div className="absolute right-0">
        <PersonaltrumBgOverlay />
      </div>
    </div>
  );
};

export default PageNotFound;
