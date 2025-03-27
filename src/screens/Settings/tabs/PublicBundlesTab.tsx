import React, { useState } from "react";
import PresetBundleCard, {
  PresetBundleCardSkeleton,
} from "../../../components/cards/PresetBundleCard";
import { useSelector } from "react-redux";
import { BundlesResponse } from "../../../types/Product";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { fetchBundles } from "../api";
import PublicBundleBulkDisable from "../../../components/modals/PublicBundleBulkDisable";
import { ButtonComponent } from "../../../components/common/Button";

const PublicBundlesTab = ({ allowModification }: { allowModification: boolean }) => {
  const { allCompanies } = useSelector((state) => state.companies);
  const { t } = useTranslation();
  const [showDisableAllModal, setShowDisableAllModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [bundleData, setBundleData] = useState<any>(null);

  const companyIds = allCompanies.map((company) => company.id);

  const { data, isLoading, error, refetch } = useQuery<BundlesResponse>({
    queryKey: ["bundles", companyIds],
    queryFn: () => fetchBundles(companyIds, "", "public"),
  });

  if (isLoading) {
    return (
      <div className="bg-white w-full">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <PresetBundleCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white w-full">
        <div className="p-4 text-center text-danger-600">
          {t("strings.errorLoadingBundles")}
        </div>
      </div>
    );
  }

  const handleClose = () => {
    setShowOptions(false);
  };

  return (
    <div className="bg-white w-full">
      {showDisableAllModal && (
        <PublicBundleBulkDisable
          visible={showDisableAllModal}
          onClose={() => setShowDisableAllModal(false)}
        />
      )}
      <div>
        <div className="flex items-center justify-between pb-2">
          <p className="text-sm text-gray-500 mb-2">
            *{t("strings.publicBundlesInfo")}
          </p>

          <div className="flex items-center gap-2">
            <ButtonComponent
              disabled={!allowModification}
              buttonStyle="px-2"
              loading={false}
              colorScheme="primary"
              title={t("strings.disableAll")}
              onClick={() => setShowDisableAllModal(true)}
            />
          </div>
        </div>
        {!data?.data.records?.length ? (
          <></>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {data.data.records.map((bundle) => (
              <PresetBundleCard
                disableInteractions={!allowModification}
                setShowOptions={() => {
                  setBundleData(bundle);
                  setShowOptions(true);
                }}
                type="PUBLIC"
                key={bundle.ID}
                id={bundle.ID}
                editable={true}
                Name={bundle.Name}
                onClick={() => {}}
                selected={false}
                Products={bundle.Products}
                pricing={bundle.pricing}
                showAddToFavourite={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicBundlesTab;
