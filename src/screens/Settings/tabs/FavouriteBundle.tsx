import React, { useState } from "react";
import PresetBundleCard, {
  PresetBundleCardSkeleton,
} from "../../../components/cards/PresetBundleCard";
import { useSelector } from "react-redux";
import { BundlesResponse } from "../../../types/Product";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getFavouriteBundles } from "../api";
import ManageBundleAccess from "../../../components/modals/ManageBundleAccess";
import { NoFavBundle, TrashIcon } from "../../../components/icons";
import { ButtonComponent } from "../../../components/common/Button";
import FavouriteBundleCard from "../../../components/cards/FavouriteBundleCard";

const FavouriteBundleTab = ({
  allowModification,
}: {
  allowModification: boolean;
}) => {
  const { allCompanies } = useSelector((state) => state.companies);
  const { t } = useTranslation();
  const [showOptions, setShowOptions] = useState(false);
  const [bundleData, setBundleData] = useState<any>(null);

  const companyIds = allCompanies.map((company) => company.id);

  const { data, isLoading, error, refetch } = useQuery<BundlesResponse>({
    queryKey: ["favouriteBundles", companyIds],
    queryFn: () => getFavouriteBundles({ companyIds: companyIds }),
    enabled: false,
  });

  // if (isLoading) {
  //   return (
  //     <div className="bg-white w-full">
  //       <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
  //         {[1, 2, 3].map((index) => (
  //           <PresetBundleCardSkeleton key={index} />
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="bg-white w-full">
  //       <div className="p-4 text-center text-danger-600">
  //         {t("strings.errorLoadingBundles")}
  //       </div>
  //     </div>
  //   );
  // }

  const handleClose = () => {
    setShowOptions(false);
  };

  return (
    <div className="bg-white w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {allCompanies?.map((item, index) => (
        <FavouriteBundleCard company={item} key={index} />
      ))}
    </div>
  );

  return (
    <div className="bg-white w-full">
      {showOptions && (
        <ManageBundleAccess
          bundleData={bundleData}
          visible={showOptions}
          onClose={handleClose}
        />
      )}
      <div>
        <div className="flex items-center justify-between pb-2">
          <h3>
            {!data?.data.records?.length
              ? t("strings.noBundlesFound")
              : t("strings.customizePresetBundles")}{" "}
          </h3>
        </div>
        <div className="flex items-center justify-center">
          Hi
          <NoFavBundle className="w-10 h-10" />
        </div>
        {!data?.data.records?.length ? (
          <></>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {data.data.records.map((bundle) => (
              <PresetBundleCard
                setShowOptions={() => {
                  setBundleData(bundle);
                  setShowOptions(true);
                }}
                type="PUBLIC"
                key={bundle.ID}
                editable={true}
                Name={bundle.Name}
                onClick={() => {}}
                selected={false}
                Products={bundle.Products}
                pricing={bundle.pricing}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavouriteBundleTab;
