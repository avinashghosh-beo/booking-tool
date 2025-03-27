import React, { useEffect, useState } from "react";
import ContingentsPickerCard, {
  ContingentsPickerSkeleton,
} from "../../../components/cards/ContingentsPickerCard";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import {
  fetchBudgetContingents,
  fetchFixedContingents,
  fetchFreeContingents,
} from "../../Contingents/api";
import { useSearchParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";

const LIMIT = 10;

const ChooseFromContingents = () => {
  const { setValue, watch } = useFormContext();
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [params] = useSearchParams();
  const { selectedCompanies } = useSelector((state) => state.companies);
  const budgetContingentsQuery = useQuery({
    queryKey: ["budgetContingentsQuery", selectedCompanies],
    queryFn: () =>
      fetchBudgetContingents({
        company: watch("RecieverCompany").value,
        skip: page,
        limit: LIMIT,
      }),
    enabled: true,
    select: (res) => res.data.records,
    keepPreviousData: true,
  });

  const fixedContingentsQuery = useQuery({
    queryKey: ["fixedContingentsQuery", selectedCompanies],
    queryFn: () =>
      fetchFixedContingents({
        company: watch("RecieverCompany").value,
        skip: page,
        limit: LIMIT,
      }),
    enabled: true,
    select: (res) => res.data.records,
    keepPreviousData: true,
  });

  const freeContingentsQuery = useQuery({
    queryKey: ["freeContingentsQuery", selectedCompanies],
    queryFn: () =>
      fetchFreeContingents({
        company: watch("RecieverCompany").value,
        skip: page,
        limit: LIMIT,
      }),
    enabled: true,
    select: (res) => res.data.records,
    keepPreviousData: true,
  });

  useEffect(() => {
    const incomingContingentID = params.get("contingentID");
    const incomingContingentType = params.get("type");

    // Only proceed if we have both ID and type, and the relevant query data is available
    if (!incomingContingentID || !incomingContingentType) return;

    // Wait for the relevant query data to be available
    const queryData = {
      budget: budgetContingentsQuery.data,
      free: freeContingentsQuery.data,
      fixed: fixedContingentsQuery.data,
    }[incomingContingentType];

    if (!queryData) return;

    // Find the contingent
    const contingent = queryData.find(
      (item) => item.ID === incomingContingentID
    );

    // Set the value if found
    if (contingent) {
      setValue("selectedContingent", contingent);
    }
  }, [
    params,
    // Only include the data properties, not the whole query objects
    budgetContingentsQuery.data,
    fixedContingentsQuery.data,
    freeContingentsQuery.data,
    setValue,
  ]);

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg">
      <div className="flex-grow md:pr-4">
        {budgetContingentsQuery.isSuccess &&
          budgetContingentsQuery.data.length > 0 && (
            <h2 className="mb-4 text-xl font-semibold text-primary-800">
              {t("labels.budgetBasedContingents")}
            </h2>
          )}

        {budgetContingentsQuery.isLoading && (
          <>
            <Skeleton className="h-10 w-72 mb-2" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              <ContingentsPickerSkeleton />
              <ContingentsPickerSkeleton />
              <ContingentsPickerSkeleton />
              <ContingentsPickerSkeleton />
            </div>
          </>
        )}

        {budgetContingentsQuery.isSuccess &&
          budgetContingentsQuery.data.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {budgetContingentsQuery.data.map((item, index) => (
                <ContingentsPickerCard
                  type="Budget"
                  key={index}
                  data={item}
                  selected={watch("selectedContingent")?.ID === item.ID}
                  onSelect={(currentObj) => {
                    setValue("selectedContingent", currentObj);
                    setValue("selectedContingentType", "Budget");
                  }}
                />
              ))}
            </div>
          )}

        {fixedContingentsQuery.isSuccess &&
          fixedContingentsQuery.data.length > 0 && (
            <div className="my-4">
              <h2 className="text-xl font-semibold text-primary-800">
                {t("labels.fixedNumberOfAdsContingents")}
              </h2>
            </div>
          )}

        {fixedContingentsQuery.isLoading && (
          <>
            <div className="my-4">
              <Skeleton className="h-10 w-72" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              <ContingentsPickerSkeleton />
              <ContingentsPickerSkeleton />
              <ContingentsPickerSkeleton />
              <ContingentsPickerSkeleton />
            </div>
          </>
        )}

        {fixedContingentsQuery.isSuccess &&
          fixedContingentsQuery.data.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {fixedContingentsQuery.data.map((item, index) => (
                <ContingentsPickerCard
                  type="Fixed"
                  key={index}
                  data={item}
                  selected={watch("selectedContingent")?.ID === item.ID}
                  onSelect={() => {
                    setValue("selectedContingent", item);
                    setValue("selectedContingentType", "Fixed");
                  }}
                />
              ))}
            </div>
          )}

        {freeContingentsQuery.isSuccess &&
          freeContingentsQuery.data.length > 0 && (
            <div className="flex flex-col items-center justify-between my-4 lg:flex-row">
              <h2 className="text-xl font-semibold text-primary-800">
                {t("labels.freeListingContingents")}
              </h2>
            </div>
          )}

        {freeContingentsQuery.isLoading && (
          <>
            <div className="flex flex-col items-center justify-between my-8 lg:flex-row">
              <Skeleton className="h-10 w-72 mb-2" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              <ContingentsPickerSkeleton />
              <ContingentsPickerSkeleton />
              <ContingentsPickerSkeleton />
              <ContingentsPickerSkeleton />
            </div>
          </>
        )}

        {freeContingentsQuery.isSuccess &&
          freeContingentsQuery.data.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {freeContingentsQuery.data.map((item, index) => (
                <ContingentsPickerCard
                  type="Free"
                  key={index}
                  data={item}
                  selected={watch("selectedContingent")?.ID === item.ID}
                  onSelect={() => {
                    setValue("selectedContingent", item);
                    setValue("selectedContingentType", "Free");
                  }}
                />
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

export default ChooseFromContingents;
