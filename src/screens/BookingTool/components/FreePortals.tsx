import React, { useState } from "react";
import { fetchFreePortalsByCatagory } from "../api";
import { ButtonComponent } from "../../../components/common/Button";
import PortalCostListingCard, {
  PortalCostListingCardSkeleton,
} from "../../../components/cards/PortalCostListingCard";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { removeDuplicatesByID } from "../../../utils/array";
import UpgradeOptionsButton from "../../Contingents/components/UpgradeOptionsComponent";
import Skeleton from "react-loading-skeleton";

const LIMIT = 10;

const FreePortals = ({ renderCart, handleAddToCart, data, setData }) => {
  const { t } = useTranslation();
  const { watch } = useFormContext();
  const [page, setPage] = useState(0);

  const freePortalListingsQuery = useQuery({
    queryKey: ["freePortalListings", page, watch("RecieverCompany")?.value],
    queryFn: () =>
      fetchFreePortalsByCatagory({
        ProductCategory: "",
        offset: page * LIMIT,
        limit: LIMIT,
        company: [watch("RecieverCompany")?.value],
      }),
    onSuccess: (res) => {
      if (res?.products.length > 0) {
        let newData = [...data, ...res.products];
        newData = removeDuplicatesByID(newData);
        setData(newData);
      }
    },
    select: (res) => res.data,
    enabled: !!watch("RecieverCompany")?.value,
  });

  // Safely access data for pagination
  const totalPages = freePortalListingsQuery.data?.totalPages ?? 0;
  const showLoadMore = totalPages > 0 && data.length < totalPages;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 max-h-[70vh] overflow-hidden overflow-y-auto">
          <div className="flex flex-col w-full pb-2">
            {freePortalListingsQuery.isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <UpgradeOptionsButton
                data={freePortalListingsQuery.data?.credits}
                className="w-full"
              />
            )}
          </div>
          <div className="gap-4 pr-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mr-4">
            {data?.map((item, index) => (
              <div key={index}>
                <PortalCostListingCard
                  data={item}
                  selected={watch("portalsCart")?.id === item?.id}
                  onClick={() => {
                    handleAddToCart(item, "Free");
                  }}
                />
              </div>
            ))}
            {freePortalListingsQuery.isLoading &&
              Object.keys(watch("productCatagory")).length > 0 && (
                <>
                  <PortalCostListingCardSkeleton />
                  <PortalCostListingCardSkeleton />
                  <PortalCostListingCardSkeleton />
                  <PortalCostListingCardSkeleton />
                </>
              )}
          </div>
          {showLoadMore && (
            <div className="p-4 col-span-2 grid place-items-center">
              <ButtonComponent
                loading={
                  freePortalListingsQuery.isLoading ||
                  freePortalListingsQuery.isFetching
                }
                colorScheme="default"
                title={t("buttonLabels.loadMore")}
                onClick={() => setPage((current) => current + 1)}
              />
            </div>
          )}
        </div>
        <div className="lg:col-span-1 pl-2">{renderCart()}</div>
      </div>
    </>
  );
};

export default FreePortals;
