import React, { useEffect, useState } from "react";
import Modal from "../hoc/Modal";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { uploadImage } from "./api";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { getImages } from "./api";
import ImageOptions from "../modals/ImageOptions";
import {
  ImageDisplayCard,
  ImageDisplayCardSkeleton,
} from "../cards/ImagePickerCard";
import FileFolders from "../FileFolders";
import Actions from "../../screens/MediaLibrary/components/Actions";
import {
  compressImage,
  getAspectWidthAndHeightFromImageWidthAndHeight,
  getCroppedImage,
  urlToFile,
} from "../../utils/image";
import {
  archiveImage,
  getArchives,
  getSharedImages,
  renameImage,
  unarchiveImage,
} from "../../screens/MediaLibrary/api";
import Header from "./components/Header";

interface ImagePickerProps {
  visible: boolean;
  onClose: Function;
  onSelect: Function;
  type?: string;
  imageRatio?: string;
  companyId?: string;
  aspectWidth?: number;
  aspectHeight?: number;
}

interface FolderItem {
  id: number;
  name: string;
  children: FolderItem[];
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  visible,
  imageRatio,
  onClose,
  onSelect = () => {},
  type = "image",
  companyId = null,
  aspectWidth,
  aspectHeight,
}) => {
  const { t } = useTranslation();
  const { selectedCompanies, allCompanies } = useSelector(
    (state: any) => state.companies
  );
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [manageAccessVisibleId, setManageAccessVisibleId] = useState(null);
  const [manageAccessVisibleName, setManageAccessVisibleName] = useState(null);
  const [renameImageVisibleId, setRenameImageVisibleId] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<FolderItem | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageOptionsVisible, setImageOptionsVisible] = useState(false);

  const handleFolderSelect = (folder) => {
    setSelectedFolder(folder);
  };

  const imagesQuery = useQuery({
    queryKey: [
      "images",
      selectedFolder?.ID,
      selectedFolder?.CompanyID,
      companyId,
    ],
    queryFn: () => {
      if (selectedFolder?.ID === "ARCHIVES")
        return getArchives(selectedFolder.company, 100, 0);
      else if (selectedFolder?.ID === "SHARED_IMAGES")
        return getSharedImages(selectedFolder.company, 100, 0);
      return getImages(selectedFolder.CompanyID, selectedFolder?.ID, 100, 0);
    },
    enabled: selectedFolder !== null && selectedFolder.ID !== "SHARED_FOLDERS",
  });

  const renameImageMutation = useMutation({
    mutationFn: ({ imageId, title }) =>
      renameImage({ imageId, title, company: selectedFolder?.CompanyID }),
    onSuccess: () => {
      imagesQuery.refetch();
      setRenameImageVisibleId(false);
    },
    onError: (error) => {
      console.error("Error renaming image:", error);
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: (formData: FormData) => uploadImage(formData),
    onSuccess: () => {
      imagesQuery.refetch();
      setFile(null);
      setImageOptionsVisible(false);
    },
    onError: (error) => {
      console.error("Error uploading image:", error);
    },
  });

  const handleImageSelect = async (croppedImageData: any) => {
    if (!file || !selectedFolder) return;

    try {
      // First crop the image
      const croppedImage = await getCroppedImage(file, croppedImageData);

      // Then compress it with the exact dimensions from cropping
      const compressedImage = await compressImage(croppedImage, {
        maxSizeInMB: 1,
        quality: 0.9,
        width: croppedImageData.width,
        height: croppedImageData.height,
      });

      // Convert compressed blob to File object
      const compressedFile = new File([compressedImage], file.name, {
        type: "image/jpeg",
        lastModified: new Date().getTime(),
      });

      // Create URL for preview if needed
      const imageUrl = URL.createObjectURL(compressedFile);
      setCroppedImageUrl(imageUrl);

      const title = file.name.split(".")[0];

      const formData = new FormData();
      formData.append("Title", title);
      formData.append("File", compressedFile); // Use the File object instead of blob
      formData.append("FolderID", selectedFolder.ID.toString());
      formData.append("Size", croppedImageData.width.toString());
      formData.append("Type", "image");
      formData.append("company", companyId || selectedCompanies[0].toString());
      formData.append("aspectWidth", croppedImageData.width.toString());
      formData.append("aspectHeight", croppedImageData.height.toString());

      uploadImageMutation.mutate(formData);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (croppedImageUrl) {
        URL.revokeObjectURL(croppedImageUrl);
      }
    };
  }, [croppedImageUrl]);

  const renderActions = (item) => (
    <Actions
      setManageAccessVisible={() => {
        setManageAccessVisibleId(item.ID);
        setManageAccessVisibleName(item.Title);
      }}
      setRenameImageVisibleId={() => setRenameImageVisibleId(item.ID)}
    />
  );

  const handleRenameImage = (id: string, name: string) => {
    renameImageMutation.mutate({ imageId: id, title: name });
  };

  async function setImageFile(url, title) {
    const file = await urlToFile(url, title);
    setFile(file);
    setImageOptionsVisible(true);
  }

  const handleCropToUse = (item) => {
    if (item) {
      setImageFile(item?.URL, item?.Title);
    }
  };

  return (
    <Modal
      size="8xl"
      isVisible={visible}
      onClose={() => {
        setSelectedFolder(null);
        onClose();
      }}
    >
      <>
        <ImageOptions
          aspectWidth={aspectWidth}
          aspectHeight={aspectHeight}
          isLoading={uploadImageMutation.isLoading}
          file={file}
          setFile={setFile}
          visible={imageOptionsVisible}
          onClose={() => {
            setImageOptionsVisible(false);
            setCroppedImageUrl(null);
          }}
          onSelect={handleImageSelect}
        />
        <div className="overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b text-black-500 hover:text-black-600">
            <p className="text-lg font-semibold text-primary">
              {t("screenNames.mediaLibrary")}
            </p>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-4 pt-2 rounded-lg max-h-[80vh] overflow-hidden overflow-y-scroll sm:overflow-y-hidden">
            <div className="w-86 min-w-86 p-4 bg-gray-100 rounded-l">
              <div className="overflow-auto pr-2 h-[80vh]">
                <FileFolders
                  mode="IMAGE_PICKER"
                  companyId={companyId}
                  selectedFolder={selectedFolder}
                  handleFolderSelect={handleFolderSelect}
                />
              </div>
            </div>
            <div className="p-4">
              <Header
                imageRatio={imageRatio}
                setImageOptionsVisible={setImageOptionsVisible}
                selectedFolder={selectedFolder}
              />
              <div className="h-[60vh] overflow-auto">
                {selectedFolder === null && (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-lg font-semibold text-primary">
                      {t("strings.selectFolderToDisplay")}
                    </p>
                  </div>
                )}

                {imagesQuery.isFetching && (
                  <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
                    <ImageDisplayCardSkeleton />
                    <ImageDisplayCardSkeleton />
                    <ImageDisplayCardSkeleton />
                    <ImageDisplayCardSkeleton />
                    <ImageDisplayCardSkeleton />
                  </div>
                )}

                {imagesQuery.isSuccess &&
                  imagesQuery.data?.data?.totalRecords < 1 && (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-lg font-semibold text-primary">
                        {t("strings.selectedFolderEmpty")}
                      </p>
                    </div>
                  )}
                {selectedFolder !== null &&
                  imagesQuery.isSuccess &&
                  imagesQuery.data?.data?.totalRecords > 0 && (
                    <>
                      <div className="grid grid-cols-1 gap-4 mb-4 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
                        {imagesQuery.data?.data?.records.map((item, index) => (
                          <ImageDisplayCard
                            selectedFolder={selectedFolder}
                            targetAspectWidth={aspectWidth}
                            targetAspectHeight={aspectHeight}
                            companyId={companyId}
                            refetch={imagesQuery.refetch}
                            onSelect={() => {
                              onSelect(item, companyId);
                              onClose();
                              setSelectedFolder(null);
                            }}
                            mode="IMAGE_PICKER"
                            setRenameImageVisibleId={setRenameImageVisibleId}
                            handleRenameImage={(id, name) =>
                              handleRenameImage(id, name)
                            }
                            isRenameLoading={renameImageMutation.isLoading}
                            renameImageVisibleId={renameImageVisibleId}
                            renderActions={renderActions}
                            imageType={
                              selectedFolder?.ID === "ARCHIVES"
                                ? "ARCHIVES"
                                : selectedFolder?.ID === "SHARED_IMAGES"
                                ? "SHARED_IMAGES"
                                : "MEDIA"
                            }
                            index={index}
                            key={index}
                            item={item}
                            onCropToUse={() => handleCropToUse(item)}
                          />
                        ))}
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      </>
    </Modal>
  );
};

export default ImagePicker;
