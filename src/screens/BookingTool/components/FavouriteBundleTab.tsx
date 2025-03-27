import React, { useState } from "react";
import { ButtonComponent } from "../../../components/common/Button";
import PresetBundleCard, {
  PresetBundleCardSkeleton,
} from "../../../components/cards/PresetBundleCard";
import { useQuery } from "@tanstack/react-query";
import { fetchBundlesByCatagory } from "../api";
import { useFormContext } from "react-hook-form";
import { removeDuplicatesByID } from "../../../utils/array";
import { useTranslation } from "react-i18next";
const LIMIT = 10;

const PublicBundlesTab: React.FC = () => {
  const { t } = useTranslation();
  const { setValue, watch } = useFormContext();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  const publicBundlesQuery = useQuery({
    queryKey: ["publicBundlePresets", watch("presetBundleCatagory")?.ID, page],
    queryFn: () =>
      fetchBundlesByCatagory({
        BundleCategory:
          watch("presetBundleCatagory")?.ID === "ALL"
            ? ""
            : watch("presetBundleCatagory")?.ID,
        limit: LIMIT,
        company: [watch("RecieverCompany").value],
        offset: page * LIMIT,
        OwnedBy: "public",
      }),
    select: (res) => res.data,
    onSuccess: (res) => {
      if (res?.records.length > 0) {
        let newData = [...data, ...res.records];
        newData = removeDuplicatesByID(newData);
        setData(newData);
      }
    },
    enabled: Object.keys(watch("presetBundleCatagory")).length > 0,
  });

  // Safely access data for pagination
  const totalPages = publicBundlesQuery.data?.totalPages ?? 0;
  const showLoadMore = totalPages > 0 && data.length < totalPages;

  return (
    <div className="bg-white w-full">
      <div className="grid grid-cols-1 gap-4 auto-rows-[minmax(min-content,max-content)] md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
        {data?.map((item, index) => (
          <PresetBundleCard
            {...item}
            Products={item.Products}
            selected={watch("selectedPresetBundle")?.ID === item?.ID}
            key={index}
            onClick={() => {
              setValue("selectedPresetBundle", item);
              setValue("portalCart", null);
            }}
            className="h-fit"
          />
        ))}
        {publicBundlesQuery.isLoading &&
          Object.keys(watch("presetBundleCatagory")).length > 0 && (
            <>
              <PresetBundleCardSkeleton />
              <PresetBundleCardSkeleton />
              <PresetBundleCardSkeleton />
              <PresetBundleCardSkeleton />
            </>
          )}
        {publicBundlesQuery.isSuccess && data.length < 1 && (
          <div>No Response To Show</div>
        )}
      </div>
      {showLoadMore && (
        <div className="grid place-items-center w-full p-4">
          <ButtonComponent
            loading={
              publicBundlesQuery.isLoading || publicBundlesQuery.isFetching
            }
            colorScheme="default"
            title={t("buttonLabels.loadMore")}
            onClick={() => setPage((current) => current + 1)}
          />
        </div>
      )}
    </div>
  );
};

export default PublicBundlesTab;
