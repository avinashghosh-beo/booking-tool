import React, { useEffect, useState } from "react";
import { ButtonComponent, SelectButton } from "../common/Button";
import Chip from "../common/Chip";
import { CropIcon, LayerIcon } from "../icons";
import Skeleton from "react-loading-skeleton";
import { Archive, ArchiveRestore, Check } from "lucide-react";
import TextInput from "../InputElements/TextInput";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { archiveImage, unarchiveImage } from "../../screens/MediaLibrary/api";
import ConfirmationModal from "../modals/Confirmation";
import Unarchive from "../modals/Unarchive";
import { getAspectWidthAndHeightFromImageWidthAndHeight } from "../../utils/image";

const ImagePickerCard = () => {
  const { t } = useTranslation();

  return (
    <div className="col-span-1 p-4 rounded-md bg-primary-50">
      <div className="relative h-48 mb-4 rounded-lg bg-primary-200">
        <div className="absolute top-1 left-1">
          <Chip showDot={false} size={"xs"} type="success">
            {t("labels.squareCompatible")}
          </Chip>
        </div>
      </div>
      <SelectButton text={t("buttonLabels.selectImage")} />
    </div>
  );
};

export default ImagePickerCard;

export const ImageDisplayCard = ({
  index,
  item,
  renderActions,
  imageType,
  renameImageVisibleId,
  handleRenameImage,
  isRenameLoading,
  setRenameImageVisibleId,
  mode = "LIBRARY_VIEW",
  onSelect,
  companyId,
  refetch = () => {},
  targetAspectWidth,
  targetAspectHeight,
  onCropToUse,
}: {
  index: number;
  item: any;
  imageType?: string;
  renderActions?: (id: string) => React.ReactNode;
  renameImageVisibleId?: string;
  handleRenameImage?: (id: string, name: string) => void;
  isRenameLoading?: boolean;
  setRenameImageVisibleId?: () => void;
  mode?: "LIBRARY_VIEW" | "IMAGE_PICKER";
  onSelect?: () => {};
  companyId?: string;
  refetch?: () => void;
  onCropToUse?: () => void;
}) => {
  const { t } = useTranslation();
  const [renameImageName, setRenameImageName] = useState(item.Title);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);

  const archiveMutation = useMutation({
    mutationFn: () => archiveImage({ imageIds: [item.ID], company: companyId }),
    onSuccess: () => {
      setShowArchiveModal(false);
      refetch();
    },
    onError: (error) => {
      console.error("Error Archiving image:", error);
    },
  });

  const unarchiveMutation = useMutation({
    mutationFn: (folderId) =>
      unarchiveImage({
        imageIds: [item.ID],
        company: companyId,
        folderId: folderId,
      }),
    onSuccess: () => {
      setShowUnarchiveModal(false);
      refetch();
    },
    onError: (error) => {
      console.error("Error Archiving image:", error);
    },
  });

  let { aspectWidth, aspectHeight } =
    getAspectWidthAndHeightFromImageWidthAndHeight(item.Width, item.Height);

  return (
    <>
      {showArchiveModal && (
        <ConfirmationModal
          isLoading={archiveMutation.isLoading}
          visible={showArchiveModal}
          title={t("labels.archiveImage")}
          text={t("labels.archiveImageText")}
          onClose={() => setShowArchiveModal(false)}
          onConfirm={() => archiveMutation.mutate()}
          type="confirm"
        />
      )}
      {showUnarchiveModal && (
        <Unarchive
          companyId={companyId}
          visible={showUnarchiveModal}
          onClose={() => setShowUnarchiveModal(false)}
          onConfirm={(folderId) => unarchiveMutation.mutate(folderId.value)}
          loading={unarchiveMutation.isLoading}
        />
      )}
      <div key={index} className="col-span-1 p-4 rounded-md bg-primary-50">
        <div className="relative h-48 mb-2 rounded-lg bg-primary-200">
          <img
            loading="lazy"
            src={item?.URL}
            alt=""
            className="object-contain w-full h-48 rounded-lg fit-container"
          />
          <div className="absolute top-1 left-1">
            <Chip showDot={false} size={"xs"} type="warning">
              {item?.aspectHeight}x{item?.aspectWidth}
              {/* (Standardformat) */}
            </Chip>
          </div>
        </div>
        {renameImageVisibleId === item.ID ? (
          <div className="pb-1">
            <TextInput
              onBlur={() => setRenameImageVisibleId(null)}
              size="sm"
              placeholder={t("labels.newFolder")}
              errorMessages={[]}
              register={() => {}}
              id="newFolder"
              type="text"
              defaultValue={renameImageName}
              onChange={(e) => setRenameImageName(e)}
              onButtonClick={() => handleRenameImage(item.ID, renameImageName)}
              buttonLoading={isRenameLoading}
              buttonIcon={<Check className={"size-6"} />}
            />
          </div>
        ) : (
          <div className="flex justify-between mb-2 text-primary-600 py-1">
            {item.Title}
            {imageType !== "ARCHIVES" && (
              <div className="text-primary-600">{renderActions(item)}</div>
            )}

            {mode === "IMAGE_PICKER" && imageType === "ARCHIVES" && (
              <button
                title={t("labels.unarchiveImage")}
                onClick={() => setShowUnarchiveModal(true)}
                className="text-success-700"
              >
                <ArchiveRestore />
              </button>
            )}
          </div>
        )}
        <div className="flex items-center gap-4">
          {mode === "IMAGE_PICKER" && imageType !== "ARCHIVES" && (
            <>
              {aspectWidth === targetAspectWidth &&
              aspectHeight === targetAspectHeight ? (
                <ButtonComponent
                  buttonStyle="w-full"
                  colorScheme="default"
                  size="sm"
                  title={t("buttonLabels.useThisImage")}
                  onClick={onSelect}
                />
              ) : (
                <ButtonComponent
                  buttonStyle="w-full"
                  colorScheme="default"
                  size="sm"
                  iconPlacement="center"
                  icon={<CropIcon className="" />}
                  title={t("buttonLabels.cropToUse")}
                  onClick={onCropToUse}
                />
              )}
            </>
          )}
          {mode === "LIBRARY_VIEW" && (
            <>
              <button className="grow border-2 flex justify-center gap-4  rounded-md  items-center bg-primary-50 text-primary-600 hover:border-primary-400 flex-row py-2.5 px-4 border-primary-100">
                {t("buttonLabels.showAllSizes")}
                <LayerIcon className="" />
              </button>
              {imageType === "ARCHIVES" ? (
                <button
                  title={t("labels.unarchiveImage")}
                  onClick={() => setShowUnarchiveModal(true)}
                  className="text-success-700"
                >
                  <ArchiveRestore />
                </button>
              ) : (
                <button
                  title={t("labels.archiveImage")}
                  onClick={() => setShowArchiveModal(true)}
                  className="text-danger-700"
                >
                  <Archive />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export const ImageDisplayCardSkeleton = () => {
  return (
    <div className="col-span-1 p-4 rounded-md bg-primary-50">
      <Skeleton height={"10em"} width={"100%"} className="mb-4 rounded-lg" />
      <Skeleton height={"2em"} width={"100%"} className="rounded-lg" />
    </div>
  );
};
