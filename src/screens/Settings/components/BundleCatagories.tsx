import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import {
  fetchBundleCatagories,
  createBundleCatagory,
  deleteBundleCatagory,
  updateBundleCatagory,
} from "../api";
import { SelectButton } from "../../../components/common/Button";
import { useTranslation } from "react-i18next";
import { AddOutlineIcon } from "../../../components/icons";
import CreateBundleCatagory from "../../../components/modals/CreateBundleCatagory";
import { useSelector } from "react-redux";

const BundleCatagories = ({
  selectedBundleCatagoryId,
  setSelectedBundleCatagoryId,
  disableAddNew = false,
}) => {
  const { allCompanies } = useSelector((state) => state.companies);
  const { t } = useTranslation();
  const [createCatagoryVisible, setCreateCatagoryVisible] = useState(false);

  const companyIds = allCompanies.map((company) => company.id);

  const bundleCatagoriesQuery = useQuery({
    queryKey: ["bundleCatagories", companyIds],
    queryFn: () => fetchBundleCatagories(companyIds),
    select: (res) => res.data.records,
  });

  const createBundleCatagoryMutation = useMutation({
    mutationFn: createBundleCatagory,
    onSuccess: () => {
      bundleCatagoriesQuery.refetch();
    },
    onSettled: () => {
      setCreateCatagoryVisible(false);
    },
  });

  const deleteBundleCatagoryMutation = useMutation({
    mutationFn: deleteBundleCatagory,
    onSuccess: () => {
      bundleCatagoriesQuery.refetch();
    },
  });

  const updateBundleCatagoryMutation = useMutation({
    mutationFn: updateBundleCatagory,
    onSuccess: () => {
      bundleCatagoriesQuery.refetch();
    },
  });

  const handleCloseCreateCatagory = (newBundleCatagory) => {
    if (newBundleCatagory) {
      createBundleCatagoryMutation.mutate({
        CategoryType: "company",
        Name: newBundleCatagory.name,
        CompanyID: newBundleCatagory.company.value,
      });
    } else {
      setCreateCatagoryVisible(false);
    }
  };

  return (
    <>
      <CreateBundleCatagory
        isVisible={createCatagoryVisible}
        onClose={handleCloseCreateCatagory}
        loading={createBundleCatagoryMutation.isLoading}
      />
      <div className="flex flex-row flex-wrap gap-2 pb-4">
        <div className="pr-2">
          <SelectButton
            style=""
            size="xs"
            selected={selectedBundleCatagoryId === "ALL"}
            text={t("labels.allCategories")}
            onSelect={() => {
              setSelectedBundleCatagoryId("ALL");
            }}
          />
        </div>
        {bundleCatagoriesQuery.isSuccess &&
          bundleCatagoriesQuery.data?.map((item, index) => (
            <div key={index} className="pr-2">
              <SelectButton
                style=""
                size="xs"
                customIcon={
                  item?.Products?.length > 0 ? (
                    <div
                      className={`ml-2 grid place-items-center w-6 h-6 text-xs font-bold text-white border-2 border-white rounded-full ${
                        selectedBundleCatagoryId === item?.ID
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
                selected={selectedBundleCatagoryId === item?.ID}
                text={item.Name}
                onSelect={() => {
                  setSelectedBundleCatagoryId(item);
                }}
              />
            </div>
          ))}

        <div className="">
          <SelectButton
            disabled={disableAddNew}
            style=""
            size="xs"
            customIcon={
              <AddOutlineIcon className="pl-2 text-primary-600 h-6 w-8" />
            }
            selected={false}
            text={"Add New"}
            onSelect={() => {
              setCreateCatagoryVisible(true);
            }}
          />
        </div>
        {bundleCatagoriesQuery.isLoading && (
          <div className="flex mr-2 -mt-1 gap-x-2">
            <Skeleton height={34} width={140} />
            <Skeleton height={34} width={140} />
            <Skeleton height={34} width={140} />
          </div>
        )}
      </div>
    </>
  );
};

export default BundleCatagories;
