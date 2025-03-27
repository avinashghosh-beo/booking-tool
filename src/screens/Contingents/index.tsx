import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ContingentsCard, {
  ContingentsSkeleton,
} from "../../components/cards/ContingentsCard";
import UpgradeOptionsComponent from "./components/UpgradeOptionsComponent";
import {
  fetchBudgetContingents,
  fetchFixedContingents,
  fetchFreeContingents,
} from "./api";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const page = 0;
const LIMIT = 10;

const Contingents = () => {
  const { t } = useTranslation();
  const [expandedId1, setExpandedId1] = useState(null);
  const [expandedId2, setExpandedId2] = useState(null);
  const [expandedId3, setExpandedId3] = useState(null);

  const navigate = useNavigate();

  const { selectedCompanies } = useSelector((state) => state.companies);

  const budgetContingentsQuery = useQuery({
    queryKey: ["budgetContingentsQuery", selectedCompanies],
    queryFn: () =>
      fetchBudgetContingents({
        company: selectedCompanies,
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
        company: selectedCompanies,
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
        company: selectedCompanies,
        skip: page,
        limit: LIMIT,
      }),
    enabled: true,
    select: (res) => res.data.records,
    keepPreviousData: true,
  });

  return (
    <div className="flex flex-col w-full h-full p-4 bg-white rounded-lg">
      <div className="flex-grow overflow-hidden overflow-y-auto md:pr-4">
        <h2 className="mb-4 text-xl font-semibold text-primary-800">
          {t("labels.budgetBasedContingents")}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {budgetContingentsQuery.isLoading && (
            <>
              <ContingentsSkeleton />
              <ContingentsSkeleton />
              <ContingentsSkeleton />
            </>
          )}
          {budgetContingentsQuery.isSuccess &&
            budgetContingentsQuery.data.map((item, index) => (
              <ContingentsCard
                type="Budget"
                key={index}
                data={item}
                isExpanded={expandedId1 === index}
                setExpanded={() =>
                  setExpandedId1(expandedId1 === index ? null : index)
                }
                onClickUse={() => {
                  navigate(`/booking-tool?contingentID=${item.ID}&type=budget`);
                }}
              />
            ))}
        </div>

        <div className="my-8">
          <h2 className="mb-4 text-xl font-semibold text-primary-800">
            {t("labels.fixedNumberOfAdsContingents")}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {fixedContingentsQuery.isLoading && (
            <>
              <ContingentsSkeleton />
              <ContingentsSkeleton />
              <ContingentsSkeleton />
            </>
          )}
          {fixedContingentsQuery.isSuccess &&
            fixedContingentsQuery.data.map((item, index) => (
              <ContingentsCard
                type="Fixed"
                key={index}
                data={item}
                isExpanded={expandedId2 === index}
                setExpanded={() =>
                  setExpandedId2(expandedId2 === index ? null : index)
                }
                onClickUse={() => {
                  navigate(`/booking-tool?contingentID=${item.ID}&type=fixed`);
                }}
              />
            ))}
        </div>
        {/*  */}
        <div className="flex flex-col items-center justify-between my-8 lg:flex-row">
          <h2 className="text-xl font-semibold text-primary-800">
            {t("labels.freeListingContingents")}
          </h2>
          <UpgradeOptionsComponent />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {freeContingentsQuery.isLoading && (
            <>
              <ContingentsSkeleton />
              <ContingentsSkeleton />
              <ContingentsSkeleton />
            </>
          )}
          {freeContingentsQuery.isSuccess &&
            freeContingentsQuery.data.map((item, index) => (
              <ContingentsCard
                key={index}
                data={item}
                type="Free"
                setExpanded={() =>
                  setExpandedId3(expandedId3 === index ? null : index)
                }
                isExpanded={expandedId3 === index}
                onClickUse={() => {
                  navigate(`/booking-tool?contingentID=${item.ID}&type=free`);
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Contingents;
