import React from "react";
import SearchInput from "../../common/SearchInput";
import { ButtonComponent } from "../../common/Button";
import { useTranslation } from "react-i18next";

const Header = ({ imageRatio, setImageOptionsVisible, selectedFolder }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-gray-100">
      {imageRatio ? (
        <p className="text-lg font-semibold text-primary">
          {t("embeddedStrings.chooseImageWithRatio", { ratio: imageRatio })}
        </p>
      ) : (
        <p className="text-lg font-semibold text-primary">
          {t("strings.chooseImage")}
        </p>
      )}
      <div className="flex flex-wrap gap-4">
        <div>
          <SearchInput
            showIcon
            iconPosition="right"
            placeholder={t("shortStrings.searchMedia")}
            onSearch={console.log}
          />
        </div>
        <div className="flex gap-2">
          <ButtonComponent
            onClick={() => setImageOptionsVisible(true)}
            colorScheme="primary"
            title={t("buttonLabels.uploadImage")}
            size="sm"
            buttonStyle="w-full"
            disabled={!selectedFolder}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
