import React from "react";
import { useTranslation } from "react-i18next";
import TabView from "../../components/common/TabView";
import RightsSettings from "./tabs/RightsSettings";
import SystemNotificationSettings from "./tabs/SystemNotificationSettings";
import PackageSettings from "./tabs/PackageSettings";
import ManageSubscriptions from "./tabs/ManageSubscriptions";

const Settings = () => {
  const { t } = useTranslation();
  const tabs = [
    {
      id: 1,
      title: t("screenNames.manageSubscriptions"),
      component: <ManageSubscriptions />,
    },
    {
      id: 2,
      title: t("screenNames.rightsSettings"),
      component: <RightsSettings />,
    },
    {
      id: 3,
      title: t("screenNames.systemNotificationSettings"),
      component: <SystemNotificationSettings />,
    },
    {
      id: 4,
      title: t("screenNames.packageSettings"),
      component: <PackageSettings />,
    },
  ];

  return (
    <div className="flex flex-col overflow-hidden overflow-y-auto w-full h-full p-4 bg-white rounded-lg">
      <TabView tabs={tabs} onTabChange={() => {}} />
    </div>
  );
};

export default Settings;
