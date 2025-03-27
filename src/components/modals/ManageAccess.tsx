import React, { useMemo } from "react";
import Modal from "../hoc/Modal";
import { ButtonComponent } from "../common/Button";
import { useTranslation } from "react-i18next";
import { File, Folder, Network } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAccessListFolder,
  getAccessListImage,
  revokeAccessFolder,
  revokeAccessImage,
  shareAccessFolder,
  shareAccessImage,
} from "../FileFolders/api";
import { useSelector } from "react-redux";

interface ManageAccessProps {
  visible: boolean;
  onClose: Function;
  itemName: string;
  itemId: string;
  type: "FOLDER" | "FILE";
}
const ManageAccess: React.FC<ManageAccessProps> = ({
  visible,
  onClose,
  type,
  itemName,
  itemId = null,
}) => {
  const { allCompanies } = useSelector((state: any) => state.companies);
  const { t } = useTranslation();

  const { data, isFetching, isSuccess, isError, refetch } = useQuery({
    queryKey: ["accessList", itemId],
    queryFn: () => {
      if (type === "FOLDER") {
        return getAccessListFolder(itemId);
      } else {
        return getAccessListImage(itemId);
      }
    },
    select: (res) => res?.data?.records,
    initialData: [],
    enabled: itemId !== null && visible,
  });

  const grantAccessMutation = useMutation({
    mutationFn: ({ companyId }) => {
      if (type === "FOLDER") {
        return shareAccessFolder({
          folderId: itemId,
          companyId: companyId,
        });
      } else {
        return shareAccessImage({
          imageId: itemId,
          companyId: companyId,
        });
      }
    },
    onSuccess: () => {
      refetch();
    },
  });

  const revokeAccessMutation = useMutation({
    mutationFn: ({ companyId }) => {
      if (type === "FOLDER") {
        return revokeAccessFolder({
          folderId: itemId,
          companyId: companyId,
        });
      } else {
        return revokeAccessImage({
          imageId: itemId,
          companyId: companyId,
        });
      }
    },
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
        <p className="mb-2 font-semibold">{t("screenNames.manageAccess")}</p>
        <div className="flex gap-x-2">
          {type === "FOLDER" ? <Folder /> : <File />}
          <span className="text-md">{itemName}</span>
        </div>
        <div className="max-h-96 overflow-hidden overflow-y-auto">
          {companyOptions.map((item, index) => (
            <div className="p-2 bg-primary-50 mb-2 rounded-md" key={index}>
              <div className="items-center cursor-pointer flex justify-between">
                {item.label}
                <div className="flex">
                  {data &&
                  data.map((item) => item.CompanyID).includes(item.value) ? (
                    <ButtonComponent
                      size="sm"
                      disabled={revokeAccessMutation.isLoading}
                      onClick={() => {
                        revokeAccessMutation.mutate({
                          companyId: item.value,
                        });
                      }}
                      colorScheme="light"
                      title={t("buttonLabels.revokeAccess")}
                    />
                  ) : (
                    <ButtonComponent
                      size="sm"
                      disabled={grantAccessMutation.isLoading}
                      onClick={() => {
                        grantAccessMutation.mutate({
                          companyId: item.value,
                        });
                      }}
                      colorScheme="primary"
                      title={t("buttonLabels.grantAccess")}
                    />
                  )}
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

export default ManageAccess;
