import React, { useState, useRef, useEffect } from "react";
import { fetchPaidPortalsByCatagory } from "../api";
import { ButtonComponent } from "../../../components/common/Button";
import PortalCostListingCard, {
  PortalCostListingCardSkeleton,
} from "../../../components/cards/PortalCostListingCard";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { removeDuplicatesByID } from "../../../utils/array";

const LIMIT = 10;

const PaidPortals = ({
  renderCart,
  renderCatagories,
  handleAddToCart,
  data,
  setData,
}) => {
  const { t } = useTranslation();
  const { 
    watch, 
  } = useFormContext();
  const [page, setPage] = useState(0);
  const scrollContainerRef = useRef(null);
  const isLoadingMore = useRef(false);

  const portalListingsQuery = useQuery({
    queryKey: [
      "paidPortalListings",
      watch("productCatagory")?.ID === t("shortStrings.all")
        ? ""
        : watch("productCatagory")?.ID,
      page,
      watch("RecieverCompany").value,
    ],
    queryFn: () =>
      fetchPaidPortalsByCatagory({
        ProductCategory:
          watch("productCatagory")?.ID === "ALL"
            ? ""
            : watch("productCatagory")?.ID,
        skip: page * LIMIT,
        limit: LIMIT,
        company: [watch("RecieverCompany").value],
      }),
    onSuccess: (res) => { 
      if (res?.records.length > 0) {
        let newData = [...data, ...res.records];
        newData = removeDuplicatesByID(newData);
        setData(newData);
      }
    },
    select: (res) => res.data,
    enabled: !!watch("RecieverCompany")?.value,
  });

  // Safely access data for pagination
  const totalPages = portalListingsQuery.data?.totalPages ?? 0;
  const showLoadMore = totalPages > 0 && data.length < totalPages * LIMIT;

  // Modified scroll event handler
  useEffect(() => {
    let timeoutId;

    const handleScroll = (e) => {
      const element = e.target;

      // Clear any pending timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set new timeout to debounce the scroll event
      timeoutId = setTimeout(() => {
        if (
          element.scrollHeight - element.scrollTop - element.clientHeight <
            100 &&
          !portalListingsQuery.isLoading &&
          !portalListingsQuery.isFetching &&
          showLoadMore &&
          !isLoadingMore.current // Check if we're already loading
        ) {
          isLoadingMore.current = true; // Set loading flag
          setPage((current) => current + 1);
        }
      }, 300); // 300ms debounce
    };

    const currentRef = scrollContainerRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    portalListingsQuery.isLoading,
    portalListingsQuery.isFetching,
    showLoadMore,
  ]);

  // Reset loading flag when query completes
  useEffect(() => {
    if (!portalListingsQuery.isLoading && !portalListingsQuery.isFetching) {
      isLoadingMore.current = false;
    }
  }, [portalListingsQuery.isLoading, portalListingsQuery.isFetching]);

  return (
    <>
      <div className="flex flex-row flex-wrap gap-2 pb-4">
        {renderCatagories(() => setData([]))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div
          ref={scrollContainerRef}
          className="lg:col-span-2 max-h-[70vh] overflow-hidden overflow-y-auto"
        >
          <div className="gap-4 pr-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mr-4">
            {data?.map((item, index) => (
              <div key={index}>
                <PortalCostListingCard
                  data={item}
                  selected={watch("portalsCart")?.id === item?.id}
                  onClick={() => {
                    handleAddToCart(item, "paid");
                  }}
                />
              </div>
            ))}

            {portalListingsQuery.isLoading &&
              !!watch("productCatagory")?.ID && (
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
                  portalListingsQuery.isLoading ||
                  portalListingsQuery.isFetching
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

export default PaidPortals;
