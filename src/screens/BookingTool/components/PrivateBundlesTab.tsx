import React, { useState } from "react";
import {
  ButtonComponent,
  SelectButton,
} from "../../../components/common/Button";
import PresetBundleCard, {
  PresetBundleCardSkeleton,
} from "../../../components/cards/PresetBundleCard";
import { useQuery } from "@tanstack/react-query";
import { fetchBundleCatagories, fetchBundlesByCatagory } from "../api";
import Skeleton from "react-loading-skeleton";
import { useFormContext } from "react-hook-form";
import { removeDuplicatesByID } from "../../../utils/array";
import { useTranslation } from "react-i18next";
const LIMIT = 10;

const PrivateBundlesTab: React.FC = () => {
  const { t } = useTranslation();
  const { setValue, watch } = useFormContext();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  const catagoriesQuery = useQuery({
    queryKey: ["bundleCatagories"],
    queryFn: () => fetchBundleCatagories(),
    select: (res) => res.data.records,
  });

  const privateBundlesQuery = useQuery({
    queryKey: ["privateBundlePresets", watch("presetBundleCatagory")?.ID, page],
    queryFn: () =>
      fetchBundlesByCatagory({
        BundleCategory:
          watch("presetBundleCatagory")?.ID === "ALL"
            ? ""
            : watch("presetBundleCatagory")?.ID,
        limit: LIMIT,
        company: [watch("RecieverCompany").value],
        offset: page * LIMIT,
        OwnedBy: "company",
      }),
    select: (res) => res.data,
    onSuccess: (res) => {
      if (res?.records.length > 0) {
        let newData = [...data, ...res.records];
        newData = removeDuplicatesByID(newData);
        setData(newData);
      }
    },
    enabled:
      catagoriesQuery.isSuccess &&
      Object.keys(watch("presetBundleCatagory")).length > 0,
  });

  // Safely access data for pagination
  const totalPages = privateBundlesQuery.data?.totalPages ?? 0;
  const showLoadMore = totalPages > 0 && data.length < totalPages;

  return (
    <div className="bg-white w-full">
      <div className="flex flex-row flex-wrap max-w-full gap-2 pb-4 overflow-auto">
        <div className="pr-2">
          <SelectButton
            style=""
            size="xs"
            selected={watch("presetBundleCatagory")?.ID === "ALL"}
            text={t("labels.allCategories")}
            onSelect={() => {
              setValue("presetBundleCatagory", { ID: "ALL" });
              setData([]);
            }}
          />
        </div>
        {catagoriesQuery.isSuccess &&
          catagoriesQuery.data.map((item, index) => (
            <div key={index} className="pr-2">
              <SelectButton
                size="xs"
                style=""
                customIcon={
                  item?.Bundles.length > 0 ? (
                    <div
                      className={`ml-2 grid place-items-center w-6 h-6 text-xs font-bold text-white border-2 border-white rounded-full ${
                        watch("presetBundleCatagory")?.ID === item?.ID
                          ? "bg-primary-500"
                          : "bg-primary-300"
                      }`}
                    >
                      {item?.Bundles.length}
                    </div>
                  ) : (
                    <div />
                  )
                }
                selected={watch("presetBundleCatagory")?.ID === item?.ID}
                text={item?.Name}
                onSelect={() => {
                  setData([]);
                  setValue("presetBundleCatagory", item);
                }}
              />
            </div>
          ))}
        {catagoriesQuery.isLoading && (
          <div className="flex mr-2 -mt-1 gap-x-2">
            <Skeleton height={34} width={140} />
            <Skeleton height={34} width={140} />
            <Skeleton height={34} width={140} />
          </div>
        )}
      </div>

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
        {privateBundlesQuery.isLoading &&
          Object.keys(watch("presetBundleCatagory")).length > 0 && (
            <>
              <PresetBundleCardSkeleton />
              <PresetBundleCardSkeleton />
              <PresetBundleCardSkeleton />
              <PresetBundleCardSkeleton />
            </>
          )}
        {privateBundlesQuery.isSuccess && data.length < 1 && (
          <div>No Response To Show</div>
        )}
      </div>
      {showLoadMore && (
        <div className="grid place-items-center w-full p-4">
          <ButtonComponent
            loading={
              privateBundlesQuery.isLoading || privateBundlesQuery.isFetching
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

export default PrivateBundlesTab;
