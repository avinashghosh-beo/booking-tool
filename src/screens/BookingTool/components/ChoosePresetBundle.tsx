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
import PrivateBundlesTab from "./PrivateBundlesTab";
import PublicBundlesTab from "./PublicBundlesTab";
import FavouriteBundleTab from "./FavouriteBundleTab";
import TabView from "../../../components/common/TabView";
const LIMIT = 10;

const ChoosePresetBundle: React.FC = () => {
  const { t } = useTranslation();
  const { setValue, watch } = useFormContext();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  const catagoriesQuery = useQuery({
    queryKey: ["bundleCatagories"],
    queryFn: () => fetchBundleCatagories(),
    select: (res) => res.data.records,
  });

  const presetsQuery = useQuery({
    queryKey: ["presetBundlePresets", watch("presetBundleCatagory")?.ID, page],
    queryFn: () =>
      fetchBundlesByCatagory({
        BundleCategory:
          watch("presetBundleCatagory")?.ID === "ALL"
            ? ""
            : watch("presetBundleCatagory")?.ID,
        limit: LIMIT,
        company: [watch("RecieverCompany").value],
        offset: page * LIMIT,
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
  const totalPages = presetsQuery.data?.totalPages ?? 0;
  const showLoadMore = totalPages > 0 && data.length < totalPages;

  const tabs = [
    {
      id: 0,
      title: t("labels.privateBundles"),
      component: <PrivateBundlesTab />,
    },
    {
      id: 1,
      title: t("labels.publicBundles"),
      component: <PublicBundlesTab />,
    },
    {
      id: 2,
      title: t("labels.favouriteBundle"),
      component: <FavouriteBundleTab />,
    },
  ];

  return (
    <div className="pt-2">
      <TabView mode="buttons" tabs={tabs} onTabChange={() => {}} />
    </div>
  );
};

export default ChoosePresetBundle;
