import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../hoc/Modal";
import FileUploader from "../common/FileUploader";
import Cropper from "react-easy-crop";
import { ButtonComponent } from "../common/Button";
import {
  FlipIcon,
  RotateAntiClockWiseIcon,
  RotateClockWiseIcon,
} from "../icons";
import TextInput from "../InputElements/TextInput";

interface ImageSelectorProps {
  visible: boolean;
  onClose: Function;
  onSelect: Function;
  file: File;
  setFile: Function;
  isLoading: boolean;
  aspectWidth: number;
  aspectHeight: number;
}

export const ratios = [
  { id: 5 / 2, value: "5:2 (Logo) / 1140:456 (LQ Image)", width: 5, height: 2 },
  { id: 3 / 1, value: "3:1 (Wide Logo)", width: 3, height: 1 },
  { id: 4 / 1, value: "4:1 (Extra Wide Logo)", width: 4, height: 1 },
  { id: 5 / 1, value: "5:1 (Super Wide Logo)", width: 5, height: 1 },
  { id: 6 / 1, value: "6:1 (Ultra Wide Logo)", width: 6, height: 1 },
  { id: 1, value: "1:1 (Quadratisch)", width: 1, height: 1 },
  { id: 4 / 3, value: "4:3 (Standardformat)", width: 4, height: 3 },
  { id: 16 / 9, value: "16:9 (Breitbild)", width: 16, height: 9 },
  { id: 5 / 2, value: "5:2 (Landschaftsformat)", width: 5, height: 2 },
  { id: 3 / 2, value: "3:2 (Leicht breiter als hoch)", width: 3, height: 2 },
  { id: 2 / 1, value: "2:1 (Panoramaformat)", width: 2, height: 1 },
  { id: 9 / 16, value: "9:16 (Hochformat)", width: 9, height: 16 },
  { id: 2 / 3, value: "2:3 (Portrait)", width: 2, height: 3 },
  { id: 4 / 5, value: "4:5 (Portrait)", width: 4, height: 5 },
  { id: 3 / 1, value: "3:1 (Wide Banner)", width: 3, height: 1 },
  { id: 5 / 4, value: "5:4 (Leicht quadratisch)", width: 5, height: 4 },
  { id: 21 / 9, value: "21:9 (Ultra-Widescreen)", width: 21, height: 9 },
  { id: 16 / 10, value: "16:10 (Widescreen)", width: 16, height: 10 },
  { id: 1920 / 1080, value: "Background Image", width: 1920, height: 1080 },
  { id: 1140 / 456, value: "Hero/LQ Image", width: 1140, height: 456 },
];

const ImageOptions: React.FC<ImageSelectorProps> = ({
  visible,
  onClose,
  onSelect,
  file,
  setFile,
  isLoading,
  aspectWidth,
  aspectHeight,
}) => {
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const { t } = useTranslation();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const [key, setKey] = useState(0); // Force re-render key
  const [fileName, setFileName] = useState(null);

  const activeRatios = useMemo(() => {
    if (aspectWidth && aspectHeight) {
      return ratios.filter(
        (item) => item.width === aspectWidth && item.height === aspectHeight
      );
    }
    return ratios;
  }, [aspectWidth, aspectHeight]);

  // Reset cropper when flip changes to ensure proper rendering
  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [flip.horizontal, flip.vertical]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleAspectRatioChange = useCallback((e) => {
    setAspectRatio(Number(e.target.value));
  }, []);

  const handleZoomChange = useCallback((e) => {
    setZoom(Number(e.target.value));
  }, []);

  const handleRotateLeft = useCallback(() => {
    setRotation((r) => r - 90);
  }, []);

  const handleRotateRight = useCallback(() => {
    setRotation((r) => r + 90);
  }, []);

  const handleFlipHorizontal = useCallback(() => {
    setFlip((prev) => ({ ...prev, horizontal: !prev.horizontal }));
  }, []);

  const handleFlipVertical = useCallback(() => {
    setFlip((prev) => ({ ...prev, vertical: !prev.vertical }));
  }, []);

  const handleApply = useCallback(async () => {
    try {
      if (croppedAreaPixels) {
        // Include transformation data with the crop info
        const transformedCrop = {
          ...croppedAreaPixels,
          rotation,
          flip: { ...flip },
        };
        onSelect({ ...transformedCrop, name: fileName || file.name });
      }
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, onSelect, rotation, flip]);

  // Create a stable image URL
  const imageUrl = useMemo(() => {
    return file ? URL.createObjectURL(file) : "";
  }, [file]);

  // Apply flip transformations to the image before cropping
  const transformedImage = useMemo(() => {
    if (!file) return "";

    // For now, just return the URL - we'll handle flips in the component
    return imageUrl;
  }, [imageUrl, file]);

  const handleClose = useCallback(() => {
    setFlip({ horizontal: false, vertical: false });
    setRotation(0);
    setZoom(1);
    setAspectRatio(1);
    setFile(null);
    onClose();
  }, [onClose]);

  const handleFitToFrame = () => { 
    if (imageDimensions.height > imageDimensions.width) {
      setZoom(imageDimensions.width / imageDimensions.height);
    } else {
      setZoom(imageDimensions.height / imageDimensions.width);
    }
  };

  const handleFitToCenter = () => {
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (file) {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = URL.createObjectURL(file);
    }
  }, [file]);

  return (
    <Modal size="5xl" isVisible={visible} onClose={handleClose}>
      <div className="grid max-w-full gap-4">
        <h2 className="text-xl font-semibold text-primary pt-4">
          {file ? t("strings.adjustImage") : t("strings.selectImage")}
        </h2>

        <div className="grid grid-cols-4 gap-4">
          {/* Left sidebar with controls */}
          <div className="col-span-1 space-y-4 bg-gray-50 rounded-lg p-4">
            {file && (
              <div>
                <label className="block text-md font-medium text-gray-700 mb-2">
                  {t("labels.fileName")}
                </label>
                <TextInput
                  placeholder={t("labels.fileName")}
                  register={() => {}}
                  id="FileName"
                  type="text"
                  errorMessages={[]}
                  size="sm"
                  defaultValue={fileName === null ? file.name : fileName}
                  onChange={setFileName}
                />
              </div>
            )}

            <div>
              <label className="block text-md font-medium text-gray-700 mb-2">
                {t("labels.aspectRatio")}
              </label>
              <select
                className="w-full border rounded-md p-2"
                value={aspectRatio}
                onChange={handleAspectRatioChange}
              >
                {activeRatios?.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-md font-medium text-gray-700 mb-2">
                {t("labels.zoom")}
              </label>
              <input
                type="range"
                value={zoom}
                min={0.1}
                max={3}
                step={0.01}
                aria-labelledby="Zoom"
                onChange={handleZoomChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* <div>
              <label className="block text-md font-medium text-gray-700 mb-2">
                {t("labels.rotate")}
              </label>
              <div className="flex gap-2">
                <button
                  className="p-2 hover:bg-primary-100 rounded-md transition-colors"
                  onClick={handleRotateLeft}
                  type="button"
                >
                  <RotateAntiClockWiseIcon className="h-10 w-10" />
                </button>
                <button
                  className="p-2 hover:bg-primary-100 rounded-md transition-colors"
                  onClick={handleRotateRight}
                  type="button"
                >
                  <RotateClockWiseIcon className="h-10 w-10" />
                </button>
              </div>
            </div>  */}
            <div className="flex justify-center items-center">
              <ButtonComponent
                size="md"
                onClick={handleFitToFrame}
                title={"Fit to Frame"}
                colorScheme="primary"
              />
              <ButtonComponent
                size="md"
                onClick={handleFitToCenter}
                title={"Fit to Center"}
                colorScheme="primary"
              />
            </div>
          </div>

          {/* Main content area */}
          <div className="col-span-3">
            <div className="h-96 relative bg-black rounded-lg">
              {!file && (
                <FileUploader
                  file={file}
                  setFile={setFile}
                  allowedTypes={["image/png", "image/jpeg", "image/gif"]}
                  allowedExtensions={[".png", ".jpg", ".jpeg", ".gif"]}
                  showPreview={false}
                />
              )}

              {file && (
                <div className="relative h-full" key={key}>
                  <div
                    className="absolute inset-0"
                    style={{
                      transform: `scaleX(${flip.horizontal ? -1 : 1}) scaleY(${
                        flip.vertical ? -1 : 1
                      })`,
                    }}
                  >
                    <Cropper
                      image={imageUrl}
                      crop={crop}
                      zoom={zoom}
                      aspect={aspectRatio}
                      rotation={rotation}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                      minZoom={0.1}
                      maxZoom={3}
                      restrictPosition={false}
                      objectFit="contain"
                      cropShape="rect"
                      showGrid={true}
                      style={{
                        containerStyle: {
                          backgroundColor: "black",
                          width: "100%",
                          height: "100%",
                        },
                        cropAreaStyle: {
                          border: "1px solid #fff",
                        },
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with actions */}
        <div className="flex justify-end gap-2 pt-4">
          <ButtonComponent
            size="md"
            onClick={handleClose}
            title={t("buttonLabels.cancel")}
            colorScheme="default"
          />
          <ButtonComponent
            loading={isLoading}
            size="md"
            onClick={handleApply}
            title={t("buttonLabels.apply")}
            colorScheme="primary"
            disabled={!file || !croppedAreaPixels}
          />
        </div>
      </div>
    </Modal>
  );
};

export default React.memo(ImageOptions);
