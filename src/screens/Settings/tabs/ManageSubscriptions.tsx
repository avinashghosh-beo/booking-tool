import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Popover from "../../../components/common/PopoverActions";
import { CloseCircleIcon, More2Icon, MoreSquareIcon } from "../../../components/icons";
import ListView from "../../../components/common/ListView";
import { IoArrowDown, IoArrowUp, IoTime } from "react-icons/io5";
import UpgradePlanModal from "../../../components/modals/UpgradePlan";

const ManageSubscriptions = () => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({
    id: 1,
    noOfUsers: 10,
    costPerMonth: 49,
    noOfFreeListings: 10,
    isPopular: false,
  });

  const handleSelect = (data) => {
    setSelectedPlan(data);
  };

  // Dummy data for active subscriptions
  const activeSubscriptions = [
    {
      companyName: "Dummy GmbH",
      startDate: "14/02/2024",
      endDate: "27/02/2025",
      currentPlan: "Professional",
    },
    {
      companyName: "Drive Solutions",
      startDate: "01/03/2024",
      endDate: "01/03/2025",
      currentPlan: "Enterprise",
    },
  ];

  // Dummy data for inactive subscriptions
  const inactiveSubscriptions = [
    {
      companyName: "Tech Corp",
      lastActive: "15/01/2024",
    },
    {
      companyName: "Global Services Ltd",
      lastActive: "01/01/2024",
    },
  ];

  // Subscription action items for the dropdown
  const getSubscriptionActions = (isEnterprise: boolean) => [
    ...(isEnterprise
      ? []
      : [
          {
            type: "item",
            color: "success",
            title: t("shortStrings.upgradePlan"),
            icon: <IoArrowUp />,
            onClick: () => console.log("Upgrade Plan"),
          },
        ]),
    ...(isEnterprise
      ? [
          {
            type: "item",
            color: "warning",
            title: t("shortStrings.downgradePlan"),
            icon: <IoArrowDown />,
            onClick: () => console.log("Downgrade Plan"),
          },
        ]
      : []),
    {
      type: "separator",
    },
    {
      type: "item",
      color: "danger",
      title: t("shortStrings.cancelSubscription"),
      icon: <CloseCircleIcon className="w-4 h-4" />,
      onClick: () => console.log("Cancel Subscription"),
    },
  ];

  return (
    <div className="space-y-8">
      <UpgradePlanModal
        selectedPlanId={selectedPlan?.id}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleSelect}
      />
      {/* Active Subscriptions Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
       
          <h2 className="text-lg font-semibold">
            {t("screenNames.activeSubscriptions")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {activeSubscriptions.map((subscription, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-primary-50"
            >
              <div className="flex items-center justify-between pb-4 border-b border-primary-100">
                <div className="flex items-center gap-2">
                  <div className="grid p-2 text-gray-600 rounded place-items-center size-14 bg-primary-100">
                    
                  </div>
                  <div className="truncate">
                    <h3 className="text-lg font-medium text-primary-800">
                      {subscription.companyName}
                    </h3>
                  </div>

                </div>
                <Popover
                  mode="select"
                  content={
                    <ListView
                      items={getSubscriptionActions(
                        subscription.currentPlan === "Enterprise"
                      )}
                    />
                  }
                  placement="bottomRight"
                >
                  <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    {t("buttonLabels.change")}
                    <MoreSquareIcon className="size-4" strokeWidth={1}  />
                  </button>
                </Popover>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-24">{t("labels.startDate")}:</span>
                  <span className="font-semibold text-primary-500">{subscription.startDate}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-24">{t("labels.endDate")}:</span>
                  <span className="font-semibold text-primary-500">{subscription.endDate}</span>
                </div>
                <div className="flex items-center text-sm text-blue-600">
                  <span className="w-24">{t("labels.currentPlan")}:</span>
                  <span className="font-semibold text-primary-500">{subscription.currentPlan}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inactive Subscriptions Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
        
          <h2 className="text-lg font-semibold">
            {t("screenNames.inactiveSubscriptions")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {inactiveSubscriptions.map((subscription, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-primary-50"
            >
              <div className="flex items-start justify-between pb-4 border-b border-primary-100">
                <div className="flex items-center gap-2">
                  <div className="grid p-2 text-gray-600 rounded place-items-center size-14 bg-primary-100"></div>
                  <h3 className="text-lg font-medium text-primary-800">
                    {subscription.companyName}
                  </h3>
                </div>
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  {t("buttonLabels.subscribeNow")}
                </button>
              </div>

              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-24">{t("labels.lastActive")}:</span>
                  <span className="font-semibold text-primary-500">{subscription.lastActive}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageSubscriptions;
