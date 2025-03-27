import React, { useState } from "react";
import CustomizePackageModal from "../../../components/modals/CustomizePackage";
import { ButtonComponent } from "../../../components/common/Button";
import PresetBundleCard, {
  PresetBundleCardSkeleton,
} from "../../../components/cards/PresetBundleCard";
import { createBundle, deleteBundle, updateBundle } from "../api";
import { useSelector } from "react-redux";
import { Bundle, BundlesResponse } from "../../../types/Product";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchBundles } from "../api";
import { AddIcon } from "../../../components/icons";
import BundleCatagories from "../components/BundleCatagories";
import ConfirmationModal from "../../../components/modals/Confirmation";
import useToast from "../../../hooks/useToast";

const PrivateBundlesTab = ({
  allowModification,
}: {
  allowModification: boolean;
}) => {
  const showToast = useToast();
  const { allCompanies } = useSelector((state) => state.companies);
  const [isCreateNewModalOpen, setIsCreateNewModalOpen] = useState(false);
  const [editBundle, setEditBundle] = useState<Bundle | null>(null);
  const [deleteBundleId, setDeleteBundleId] = useState<string | null>(null);
  const [selectedBundleCatagoryId, setSelectedBundleCatagoryId] =
    useState("ALL");
  const { t } = useTranslation();

  const companyIds = allCompanies.map((company) => company.id);

  const { data, isLoading, error, refetch } = useQuery<BundlesResponse>({
    queryKey: ["bundles", companyIds, selectedBundleCatagoryId],
    queryFn: () => fetchBundles(companyIds, selectedBundleCatagoryId),
  });

  const createBundleMutation = useMutation({
    mutationFn: createBundle,
    onSuccess: () => {
      setEditBundle(null);
      setIsCreateNewModalOpen(false);
      refetch();
    },
    onError: (err) => {
      console.log(err);
      if (err.response.data?.data?.errorMessage) {
        showToast(err.response.data?.data?.errorMessage, {
          position: "top-right",
          hideProgressBar: true,
        });
      } else {
        showToast(t("errorMessages.errorOccurred"), {
          position: "top-right",
          hideProgressBar: true,
        });
      }
    },
  });

  const updateBundleMutation = useMutation({
    mutationFn: updateBundle,
    onSuccess: () => {
      setEditBundle(null);
      setIsCreateNewModalOpen(false);
      refetch();
    },
  });

  const deleteBundleMutation = useMutation({
    mutationFn: deleteBundle,
    onSuccess: () => {
      refetch();
      setDeleteBundleId(null);
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white w-full">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <PresetBundleCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white w-full">
        <div className="p-4 text-center text-danger-600">
          {t("strings.errorLoadingBundles")}
        </div>
      </div>
    );
  }

  const handleCreateNew = () => {
    setIsCreateNewModalOpen(true);
  };

  const handleEdit = (bundle: Bundle) => {
    setIsCreateNewModalOpen(true);
    setEditBundle(bundle);
  };

  const handleDelete = (bundle: Bundle) => {
    setDeleteBundleId(bundle.ID);
  };

  const handleConfirm = (
    bundleIds: string[],
    name: string,
    companyId: string,
    bundleId?: string
  ) => {
    if (editBundle) {
      updateBundleMutation.mutate({
        CompanyID: companyId,
        ProductIDs: bundleIds,
        Name: name,
        bundleCatagory: "",
        bundleId: bundleId,
      });
    } else {
      createBundleMutation.mutate({
        CompanyID: companyId,
        ProductIDs: bundleIds,
        Name: name,
        bundleCatagory: "",
      });
    }
  };
  return (
    <div className="bg-white w-full">
      <ConfirmationModal
        isLoading={deleteBundleMutation.isLoading}
        visible={deleteBundleId !== null}
        onClose={() => setDeleteBundleId(null)}
        onConfirm={() => deleteBundleMutation.mutate(deleteBundleId)}
        title="Delete Bundle"
        text="Are you sure you want to delete this bundle?"
        type="delete"
      />
      <CustomizePackageModal
        editBundle={editBundle}
        visible={isCreateNewModalOpen}
        onClose={() => {
          setEditBundle(null);
          setIsCreateNewModalOpen(false);
        }}
        onConfirm={handleConfirm}
      />
      <div>
        <div className="flex items-center justify-between pb-2">
          <h3>
            {/* {!data?.data.records?.length
              ? t("strings.noBundlesFound")
              : t("strings.customizePresetBundles")}{" "} */}
          </h3>

          <ButtonComponent
            disabled={!allowModification}
            loading={
              createBundleMutation.isLoading || updateBundleMutation.isLoading
            }
            colorScheme="primary"
            icon={
              !createBundleMutation.isLoading &&
              !updateBundleMutation.isLoading ? (
                <AddIcon />
              ) : (
                ""
              )
            }
            title="Create New"
            onClick={handleCreateNew}
          />
        </div>
        <BundleCatagories
          disableAddNew={!allowModification}
          setSelectedBundleCatagoryId={(item) =>
            setSelectedBundleCatagoryId(item.ID || "ALL")
          }
          selectedBundleCatagoryId={selectedBundleCatagoryId}
        />
        {!data?.data.records?.length ? (
          <></>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {data.data.records.map((bundle) => (
              <PresetBundleCard
                disableInteractions={!allowModification}
                onEdit={() => handleEdit(bundle)}
                onDelete={() => handleDelete(bundle)}
                key={bundle.ID}
                id={bundle.ID}
                editable={true}
                Name={bundle.Name}
                onClick={() => {}}
                selected={false}
                Products={bundle.Products}
                pricing={bundle.pricing}
                showAddToFavourite={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateBundlesTab;
