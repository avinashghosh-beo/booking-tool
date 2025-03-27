import React, { useMemo } from "react";
import Modal from "../hoc/Modal";
import { ButtonComponent } from "../common/Button";
import { useTranslation } from "react-i18next";
import { FileStack, Network } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  fetchBundleAccess,
  toggleBundleVisibility,
} from "../../screens/Settings/api";
import ToggleSwitch from "../common/ToggleSwitch";

interface ManageBundleAccessProps {
  visible: boolean;
  onClose: Function;
  bundleData: any;
}
const ManageBundleAccess: React.FC<ManageBundleAccessProps> = ({
  visible,
  onClose,
  bundleData,
}) => {
  const { allCompanies } = useSelector((state: any) => state.companies);
  const { t } = useTranslation();

  const { data, isFetching, isSuccess, isError, refetch } = useQuery({
    queryKey: ["accessList", bundleData?.ID],
    queryFn: () => fetchBundleAccess(bundleData?.ID),
    select: (res) => res?.data?.map((item) => item.CompanyID),
    initialData: [],
    enabled: bundleData?.ID !== null && visible,
  });

  const toggleBundleVisibilityMutation = useMutation({
    mutationFn: toggleBundleVisibility,
    onSuccess: () => {
      refetch();
    },
  });

  const companyOptions = useMemo(() => {
    return allCompanies.map((item) => ({ value: item.id, label: item?.value }));
  }, [allCompanies]);

  return (
    <Modal isVisible={visible} onClose={onClose}>
      <div className="grid max-w-full gap-4">
        <div className="flex justify-between">
          <div>
            <div className="grid rounded-full size-12 bg-secondary-50 place-items-center">
              <div className="grid rounded-full place-content-center size-10 bg-secondary-100 text-secondary-500">
                <Network />
              </div>
            </div>
          </div>
        </div>
        <p className="mb-2 font-semibold">{t("screenNames.manageVisiblity")}</p>
        <div className="flex gap-x-2">
          <FileStack />
          <span className="text-md">{bundleData?.Name}</span>
        </div>
        <div className="max-h-96 overflow-hidden overflow-y-auto">
          {companyOptions.map((item, index) => (
            <div className="p-2 bg-primary-50 mb-2 rounded-md" key={index}>
              <div className="items-center cursor-pointer flex justify-between">
                {item.label}
                <div className="flex">
                  <ToggleSwitch
                    disabled={toggleBundleVisibilityMutation.isLoading}
                    inverted={true}
                    checked={!data?.includes(item.value)}
                    onChange={() => {
                      toggleBundleVisibilityMutation.mutate({
                        bundleId: bundleData?.ID,
                        CompanyID: item.value,
                        enabled: !!data?.includes(item.value),
                      });
                    }}
                    label={!data?.includes(item.value) ? "Enabled" : "Disabled"}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <ButtonComponent
            buttonStyle="w-full"
            colorScheme="primary"
            onClick={onClose}
            title={t("buttonLabels.done")}
            size="md"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ManageBundleAccess;
