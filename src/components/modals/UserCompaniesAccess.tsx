import React, { useEffect, useMemo, useState } from "react";
import Modal from "../hoc/Modal";
import { ButtonComponent } from "../common/Button";
import { useTranslation } from "react-i18next";
import { File, Folder, Network, User } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  addCompanyAccessToUser,
  removeCompanyAccessFromUser,
} from "../../screens/Settings/api";
import ToggleSwitch from "../common/ToggleSwitch";

interface UserCompaniesAccessProps {
  visible: boolean;
  onClose: Function;
  userData: any;
}

const UserCompaniesAccess: React.FC<UserCompaniesAccessProps> = ({
  visible,
  onClose,
  userData,
}) => {
  const queryClient = useQueryClient();
  const { allCompanies } = useSelector((state: any) => state.companies);
  const { t } = useTranslation();
  const [activeCompanyIds, setActiveCompanyIds] = useState([]);

  const addCompanyAccessMutation = useMutation({
    mutationFn: addCompanyAccessToUser,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["companyUsers"] });
      setActiveCompanyIds([...activeCompanyIds, res?.data?.data?.companyId]);
    },
  });

  const removeCompanyAccessMutation = useMutation({
    mutationFn: removeCompanyAccessFromUser,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["companyUsers"] });
      setActiveCompanyIds(
        activeCompanyIds.filter((id) => id !== res?.data?.data?.companyId)
      );
    },
  });

  const handleGrantAccess = (companyId: string) => {
    addCompanyAccessMutation.mutate({
      loginUserId: userData?.ID,
      companyId: companyId,
    });
  };

  const handleRevokeAccess = (companyId: string) => {
    removeCompanyAccessMutation.mutate({
      loginUserId: userData?.ID,
      companyId: companyId,
    });
  };

  const companyOptions = useMemo(() => {
    return allCompanies.map((item) => ({ value: item.id, label: item?.value }));
  }, [allCompanies]);

  useEffect(() => {
    let incomingCompanyIds = userData?.Companies?.map((item: any) => item.ID);
    setActiveCompanyIds(incomingCompanyIds);
  }, [userData]);

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
        <p className="mb-2">
          {t("screenNames.accessList")}
          {` / `}
          <strong>{userData?.FirstName + " " + userData?.LastName}</strong>
        </p>
        <div className="max-h-96 overflow-hidden overflow-y-auto">
          {companyOptions.map((item, index) => (
            <div className="p-2 bg-primary-50 mb-2 rounded-md" key={index}>
              <div className="items-center cursor-pointer flex justify-between">
                {item.label}
                <div className="flex">
                  <ToggleSwitch
                    inverted
                    checked={activeCompanyIds.includes(item.value)}
                    onChange={() => {
                      if (activeCompanyIds.includes(item.value))
                        handleRevokeAccess(item.value);
                      else handleGrantAccess(item.value);
                    }}
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

export default UserCompaniesAccess;
