import React, { useState } from "react";
import TabView from "../../../components/common/TabView";
import { fetchProductCategories } from "../api";
import CustomPresetBundleCart from "../../../components/cards/CustomPresetBundleCart";
import { SelectButton } from "../../../components/common/Button";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { removeDuplicatesByID } from "../../../utils/array";
import PaidPortals from "./PaidPortals";
import FreePortals from "./FreePortals";

const BuildYourOwnBundle: React.FC = () => {
  const { t } = useTranslation();
  const { setValue, watch } = useFormContext();

  const [data, setData] = useState([]);

  const catagoriesQuery = useQuery({
    queryKey: ["productCatagories"],
    queryFn: () => fetchProductCategories(),
    select: (res) => res.data.records,
  });

  const renderCart = () => <CustomPresetBundleCart />;
  const renderCatagories = (onChange) => (
    <>
      <>
        <div className="pr-2">
          <SelectButton
            style=""
            size="xs"
            selected={watch("productCatagory")?.ID === "ALL"}
            text={t("labels.allCategories")}
            onSelect={() => {
              setValue("productCatagory", { ID: "ALL" });
              onChange();
            }}
          />
        </div>
        {catagoriesQuery.isSuccess &&
          catagoriesQuery.data?.map((item, index) => (
            <div key={index} className="pr-2">
              <SelectButton
                style=""
                size="xs"
                customIcon={
                  item?.Products?.length > 0 ? (
                    <div
                      className={`ml-2 grid place-items-center w-6 h-6 text-xs font-bold text-white border-2 border-white rounded-full ${
                        watch("presetBundleCatagory")?.ID === item?.ID
                          ? "bg-primary-500"
                          : "bg-primary-300"
                      }`}
                    >
                      {item?.Products.length}
                    </div>
                  ) : (
                    <div />
                  )
                }
                selected={watch("productCatagory")?.ID === item?.ID}
                text={item.Title}
                onSelect={() => {
                  setValue("productCatagory", item);
                  onChange();
                }}
              />
            </div>
          ))}
      </>
      {catagoriesQuery.isLoading && (
        <div className="flex mr-2 -mt-1 gap-x-2">
          <Skeleton height={34} width={140} />
          <Skeleton height={34} width={140} />
          <Skeleton height={34} width={140} />
        </div>
      )}
    </>
  );

  const handleAddToCart = (item: any, type: string) => {
    setValue(
      "portalsCart",
      removeDuplicatesByID([...watch("portalsCart"), item])
    );
  };

  const tabs = [
    {
      id: 0,
      title: t("labels.paidPortals"),
      component: (
        <PaidPortals
          handleAddToCart={handleAddToCart}
          renderCatagories={renderCatagories}
          renderCart={renderCart}
          data={data}
          setData={setData}
        />
      ),
    },
    {
      id: 1,
      title: t("labels.freePortals"),
      component: (
        <FreePortals
          handleAddToCart={handleAddToCart}
          renderCatagories={renderCatagories}
          renderCart={renderCart}
          data={data}
          setData={setData}
        />
      ),
    },
  ];

  const handleTabChange = (index) => {
    if (index === 0) setValue("currentCartItemType", "paid");
    else setValue("currentCartItemType", "Free");
    setValue("portalsCart", []);
    setData([]);
  };

  return (
    <TabView
      initialTabIndex={watch("currentCartItemType") === "paid" ? 0 : 1}
      containerStyles="w-full h-full"
      tabs={tabs}
      onTabChange={handleTabChange}
    />
  );
};

export default BuildYourOwnBundle;
