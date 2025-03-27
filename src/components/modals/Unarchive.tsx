import React, { useMemo, useState } from "react";
import Modal from "../hoc/Modal";
import { Network } from "lucide-react";
import { ButtonComponent } from "../common/Button";
import { useTranslation } from "react-i18next";
import SelectInput from "../InputElements/SelectInput";
import { GhostAccordion } from "../common/Accordion";
import { getAllFolders } from "../../screens/MediaLibrary/api";
import { useQuery } from "@tanstack/react-query";

const Unarchive = ({
  visible,
  onClose,
  onConfirm,
  loading,
  companyId,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedFolderId: string) => void;
  loading?: boolean;
  companyId: string;
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const folderQuery = useQuery({
    queryKey: ["folders"],
    queryFn: () => getAllFolders({ companyId: companyId }),
    select: (data) => data.data?.records,
    enabled: !!companyId,
  });

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const folderData = useMemo(() => {
    if (folderQuery.isSuccess) {
      let foldersData = folderQuery.data;
      const mapFolders = (foldersData, depth = 0) => {
        return foldersData?.reduce((acc, folder) => {
          acc.push({
            label: `${"         ".repeat(depth)}${folder.Title}`,
            value: folder.ID,
          });
          if (folder.SubFolders) {
            acc = acc.concat(mapFolders(folder.SubFolders, depth + 1));
          }
          return acc;
        }, []);
      };
      return mapFolders(foldersData);
    } else return [];
  }, [folderQuery.data]);

  const handleConfirm = () => {
    if (selectedFolderId) {
      onConfirm(selectedFolderId);
    } else {
      setError(t("errorMessages.selectFolder"));
    }
  };

  const handleClose = () => {
    setError(null);
    setSelectedFolderId(null);
    onClose();
  };

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
        <p className="mb-2 font-medium">{t("labels.unarchiveImage")}</p>
        <div className="max-h-96 overflow-hidden overflow-y-auto">
          <p>{t("labels.unarchiveImageText")}</p>
          <SelectInput
            options={folderData}
            id="folder"
            placeholder={t("labels.selectFolder")}
            selectedValue={selectedFolderId || ""}
            errorMessages={[]}
            onChange={(e) => {
              setError(null);
              setSelectedFolderId({ label: e.label.trim(), value: e.value });
            }}
          />
          <GhostAccordion
            open={error !== null}
            children={<p className="text-danger-500">*{error}</p>}
          />
        </div>

        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <ButtonComponent
            buttonStyle="w-full"
            colorScheme="light"
            onClick={handleClose}
            title={t("buttonLabels.cancel")}
            size="md"
          />
          <ButtonComponent
            loading={loading}
            buttonStyle="w-full"
            colorScheme="primary"
            onClick={handleConfirm}
            title={t("buttonLabels.done")}
            size="md"
          />
        </div>
      </div>
    </Modal>
  );
};

export default Unarchive;
