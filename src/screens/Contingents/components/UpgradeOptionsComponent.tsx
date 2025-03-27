import React from "react";
import ProgressBar from "../../../components/common/ProgressBar";
import { ButtonComponent } from "../../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UpgradeOptionsButton = ({
  className,
  data = {
    CreditsTotal: 500,
    CreditsLeft: 300,
  },
}) => { 
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/settings");
  };

  return (
    <React.Fragment>
      <div className={className ? className : "w-full p-2 lg:w-2/3 xl:w-1/2"}>
        <div className="flex items-center gap-4 p-4 rounded-lg bg-primary-100">
          <ProgressBar
            statusPlacement="left"
            showProgressStatus
            progressStatusTrailingText={t("shortStrings.inUse")}
            colorScheme="secondary"
            step={data.CreditsTotal - data.CreditsLeft}
            totalSteps={data.CreditsTotal}
          />
          <ButtonComponent
            onClick={handleRedirect}
            size="md"
            colorScheme="warning"
            title={t("shortStrings.upgradeAndUseMoreListings")}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default UpgradeOptionsButton;
