import React from "react";
import { useTranslation } from "react-i18next";
import TabView from "../../../components/common/TabView";
import PublicBundlesTab from "./PublicBundlesTab";
import PrivateBundlesTab from "./PrivateBundlesTab";
import FavouriteBundleTab from "./FavouriteBundle";
import { useAuth } from "../../../contexts/AuthContext";

const PackageSettings = () => {
  const { auth } = useAuth();
  const allowModification = auth?.user?.rights?.ModifyPackageSettings; 
  const { t } = useTranslation();

  const tabs = [
    {
      id: 0,
      title: t("labels.privateBundles"),
      component: <PrivateBundlesTab allowModification={allowModification} />,
    },
    {
      id: 1,
      title: t("labels.systemPresets"),
      component: <PublicBundlesTab allowModification={allowModification} />,
    },
    {
      id: 2,
      title: t("labels.favouriteBundle"),
      component: <FavouriteBundleTab allowModification={allowModification} />,
    },
  ];

  return (
    <>
      <TabView mode="buttons" tabs={tabs} onTabChange={() => {}} />
    </>
  );
};

export default PackageSettings;
