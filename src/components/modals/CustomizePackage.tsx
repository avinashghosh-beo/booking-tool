import React, { useEffect, useMemo, useRef, useState } from "react";
import Modal from "../hoc/Modal";
import PresetBundleCart from "../cards/PresetBundleCart";
import { PortalCostListingCardSkeleton } from "../cards/PortalCostListingCard";
import { ButtonComponent, SelectButton } from "../common/Button";
import { useTranslation } from "react-i18next";
import PortalCostListingCard from "../cards/PortalCostListingCard";
import { useQuery } from "@tanstack/react-query";
import {
  fetchPaidPortalsByCatagory,
  fetchProductCategories,
} from "../../screens/BookingTool/api";
import { removeDuplicatesById } from "../../utils/array";
import SelectInput from "../InputElements/SelectInput";
import { useSelector } from "react-redux";
import TextInput from "../InputElements/TextInput";
import Skeleton from "react-loading-skeleton";
import { fetchBundleCatagories } from "../../screens/Settings/api";
import { GhostAccordion } from "../common/Accordion";

interface CustomizePackageModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (bundleIds: string[], name: string, companyId: string) => void;
  editBundle: any;
}

const LIMIT = 10;

const CustomizePackageModal: React.FC<CustomizePackageModalProps> = ({
  visible,
  onClose,
  onConfirm,
  editBundle = null,
}) => {
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const { allCompanies, selectedCompanies } = useSelector(
    (state) => state.companies
  );
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [productCatagory, setProductCatagory] = useState(null);
  const [bundleCatagory, setBundleCatagory] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const scrollContainerRef = useRef(null);
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const isLoadingMore = useRef(false);
  const [name, setName] = useState("");

  const companyOptions = allCompanies.map((company) => ({
    label: company.value,
    value: company.id,
  }));

  const handleAddToCart = (item) => {
    if (missingFields?.includes("cartItems")) {
      setMissingFields(missingFields.filter((field) => field !== "cartItems"));
    }
    let newCartItems = [...cartItems, item];
    newCartItems = removeDuplicatesById(newCartItems);
    setCartItems(newCartItems);
  };

  const portalListingsQuery = useQuery({
    queryKey: [
      "paidPortalListings",
      productCatagory === t("shortStrings.all") ? "" : productCatagory?.ID,
      page,
    ],
    queryFn: () =>
      fetchPaidPortalsByCatagory({
        ProductCategory: productCatagory === "ALL" ? "" : productCatagory?.ID,
        skip: page * LIMIT,
        limit: LIMIT,
        company: [],
      }),
    onSuccess: (res) => {
      if (res?.records.length > 0) {
        let newData = [...data, ...res.records];
        newData = removeDuplicatesById(newData);
        setData(newData);
      } else {
        setData([]);
      }
    },
    select: (res) => res.data,
    enabled: visible,
  });

  const productCatagoriesQuery = useQuery({
    queryKey: ["productCatagories"],
    queryFn: () => fetchProductCategories(),
    select: (res) => res.data.records,
    enabled: visible,
  });

  const bundleCatagoriesQuery = useQuery({
    queryKey: ["bundleCatagories"],
    queryFn: () => fetchBundleCatagories(selectedCompanies),
    select: (res) => res.data.records,
    enabled: visible,
  });

  const bundlecatagoryOptions = bundleCatagoriesQuery.data?.map((item) => ({
    label: item.Name,
    value: item.ID,
  }));

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

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.ID !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleClose = () => {
    setMissingFields([]);
    setSelectedCompany(null);
    setCartItems([]);
    setName("");
    setBundleCatagory(null);
    onClose();
  };

  const handleConfirm = () => {
    let newMissingFields = new Set(missingFields);

    if (cartItems.length === 0) {
      newMissingFields.add("cartItems");
    } else {
      newMissingFields.delete("cartItems");
    }

    if (name === "") {
      newMissingFields.add("name");
    } else {
      newMissingFields.delete("name");
    }

    // Convert the Set back to an array if needed
    newMissingFields = Array.from(newMissingFields);

    if (newMissingFields.length > 0) {
      setMissingFields(newMissingFields);
      return;
    }

    let newProductIds = cartItems.map((item) => item.ID);
    onConfirm(newProductIds, name, selectedCompany?.value, editBundle?.ID);
  };

  useEffect(() => {
    if (editBundle && editBundle.CompanyID && editBundle.Products) {
      let company = companyOptions.find(
        (company) => company.value === editBundle.CompanyID
      );
      setSelectedCompany(company);

      let products = editBundle.Products;
      setCartItems(editBundle.Products);

      let name = editBundle.Name;
      setName(name);
    }
  }, [editBundle]);

  const showBundleDetailsModal = useMemo(() => {
    if (editBundle) {
      return false;
    }
    return selectedCompany === null || bundleCatagory === null;
  }, [selectedCompany, bundleCatagory, editBundle]);

  return (
    <>
      <Modal size="7xl" isVisible={visible} onClose={handleClose}>
        <>
          <div className="grid max-w-full gap-4 py-4">
            <h1>Customize Package</h1>
          </div>
          <div className="flex flex-row items-center gap-2 pb-2 w-full">
            <div className="fit-content">Bundle Name:</div>
            <div className="w-fit">
              <TextInput
                size="sm"
                register={() => {}}
                errorMessages={[]}
                defaultValue={name}
                onChange={(value) => {
                  setName(value);
                  if (missingFields?.includes("name") && value !== "") {
                    setMissingFields(
                      missingFields.filter((field) => field !== "name")
                    );
                  }
                }}
                placeholder="Enter Bundle Name"
                id="name"
                type="text"
              />
            </div>
          </div>

          <GhostAccordion
            open={missingFields?.includes("name")}
            children={
              <div className="text-danger-500 mb-4">
                *{t("errorMessages.bundleNameRequired")}
              </div>
            }
          />
          <div className="overflow-y-auto md:overflow-y-hidden max-h-[70vh] pr-1">
            {/* Catagories */}
            <div className="flex flex-row flex-wrap gap-2 pb-4">
              <div className="pr-2">
                <SelectButton
                  style=""
                  size="xs"
                  selected={productCatagory === "ALL"}
                  text={t("labels.allCategories")}
                  onSelect={() => {
                    setProductCatagory("ALL");
                  }}
                />
              </div>
              {productCatagoriesQuery.isSuccess &&
                productCatagoriesQuery.data?.map((item, index) => (
                  <div key={index} className="pr-2">
                    <SelectButton
                      style=""
                      size="xs"
                      customIcon={
                        item?.Products?.length > 0 ? (
                          <div
                            className={`ml-2 grid place-items-center w-6 h-6 text-xs font-bold text-white border-2 border-white rounded-full ${
                              productCatagory?.ID === item?.ID
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
                      selected={productCatagory?.ID === item?.ID}
                      text={item.Title}
                      onSelect={() => {
                        setProductCatagory(item);
                      }}
                    />
                  </div>
                ))}
              {productCatagoriesQuery.isLoading && (
                <div className="flex mr-2 -mt-1 gap-x-2">
                  <Skeleton height={34} width={140} />
                  <Skeleton height={34} width={140} />
                  <Skeleton height={34} width={140} />
                </div>
              )}
            </div>
            {/* End Catagories */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 max-w-full gap-4">
              <div
                ref={scrollContainerRef}
                className="col-span-1 md:col-span-2 xl:col-span-3 min-h-[60vh] max-h-[60vh] overflow-hidden overflow-y-auto"
              >
                <div className="grid gap-4 pr-4 grid-cols-1 lg:grid-cols-2">
                  {data?.map((item, index) => (
                    <div key={index}>
                      <PortalCostListingCard
                        showTitle
                        gridColumns={3}
                        data={item}
                        selected={cartItems[0]?.id === item?.id}
                        onClick={() => {
                          handleAddToCart(item);
                        }}
                      />
                    </div>
                  ))}

                  {portalListingsQuery.isSuccess &&
                    portalListingsQuery.data?.records.length === 0 && (
                      <div className="flex mr-2 -mt-1 gap-x-2">
                        {t("errorMessages.noData")}
                      </div>
                    )}
                  {portalListingsQuery.isLoading && (
                    <>
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
              <div className="grid col-span-1 md:col-span-1 xl:col-span-2 gap-4 max-h-[70vh] overflow-hidden overflow-y-auto">
                <PresetBundleCart
                  company={selectedCompany}
                  cartItems={cartItems}
                  removeItem={removeItem}
                  clearCart={clearCart}
                  isError={missingFields?.includes("cartItems")}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2 gap-2">
            <ButtonComponent
              size="md"
              title="Cancel"
              colorScheme="default"
              onClick={handleClose}
            />
            <ButtonComponent
              // disabled={missingFields.length > 0}
              size="md"
              title="Confirm"
              colorScheme="primary"
              onClick={handleConfirm}
            />
          </div>
        </>
      </Modal>
      {showBundleDetailsModal && (
        <Modal size="sm" isVisible={visible} onClose={handleClose}>
          <>
            <div className="grid max-w-full gap-4 py-4">
              <h1>Bundle Details</h1>
            </div>
            <div className="pb-4">
              <SelectInput
                label="Select Company"
                id="company"
                selectedValue={selectedCompany}
                placeholder="Select Company"
                errorMessages={[]}
                options={companyOptions}
                onChange={(e) => setSelectedCompany(e)}
              />
            </div>
            <div className="">
              <SelectInput
                label="Bundle Catagory"
                id="bundleCatagory"
                selectedValue={bundleCatagory}
                placeholder="Select Bundle Catagory"
                errorMessages={[]}
                options={bundlecatagoryOptions}
                onChange={(e) => setBundleCatagory(e)}
              />
            </div>
          </>
        </Modal>
      )}
    </>
  );
};

export default CustomizePackageModal;
